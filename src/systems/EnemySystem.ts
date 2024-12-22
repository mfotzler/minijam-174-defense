import * as Phaser from 'phaser';
import { EntityDefinition } from '../engine/entities/types';
import { EventType, System } from '../engine/types';
import { BugComponents, Direction } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import { AntCorpse, BabyEaterAntCorpse, BeetleCorpse } from '../entities/Corpses';
import InvincibilitySystem from './InvincibilitySystem';
import EnemyBehaviorFactory from './EnemyBehaviors/EnemyBehaviorFactory';

export class EnemySystem implements System {
	constructor(
		private scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, this.onPlayerCollision.bind(this));
		MessageBus.subscribe(EventType.PROJECTILE_COLLISION, this.onProjectileCollision.bind(this));
		MessageBus.subscribe(EventType.KILL_ENEMY, this.onKillEnemy.bind(this));
		MessageBus.subscribe(EventType.SPAWN_CORPSE, this.onSpawnCorpse.bind(this));
	}

	private onPlayerCollision({ id }: { id: string }) {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		const enemyEntity = this.world.entityProvider.getEntity(id);

		if (!playerEntity?.player || !enemyEntity?.enemy) return;

		MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: enemyEntity.enemy.damage });
	}

	private onProjectileCollision({ id, damage }: { id: string; damage: number }) {
		const enemyEntity = this.world.entityProvider.getEntity(id);

		if (!enemyEntity?.enemy || InvincibilitySystem.isInvincible(enemyEntity)) return;

		enemyEntity.enemy.health = (enemyEntity.enemy.health ?? 1) - damage;

		if (enemyEntity.enemy.health <= 0) {
			MessageBus.sendMessage(EventType.KILL_ENEMY, { entityId: id });
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_2' });
		} else {
			if (InvincibilitySystem.canBeMadeInvincible(enemyEntity)) {
				MessageBus.sendMessage(EventType.ENTITY_MAKE_INVINCIBLE, enemyEntity);
			}

			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
		}
	}

	private onKillEnemy({ entityId }: { entityId: string }) {
		const entity = this.world.entityProvider.getEntity(entityId);
		if (!entity?.enemy) return;

		MessageBus.sendMessage(EventType.SPAWN_CORPSE, entity);
		MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId });
	}

	private corpseTypes: Record<string, BugComponents> = {
		ant: AntCorpse,
		beetle: BeetleCorpse,
		babyEaterAnt: BabyEaterAntCorpse
	};

	private onSpawnCorpse(entity: EntityDefinition<BugComponents>) {
		const corpse = this.corpseTypes[entity.enemy?.corpseType ?? 'ant'];

		if (!corpse) return;

		this.world.createEntity(corpse, entity.render?.sprite?.transform ?? { x: 0, y: 0 });
	}

	step({ delta }) {
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.enemy) {
				if (entity.collision.blocked?.down) {
					entity.render?.sprite?.body.setVelocityX(0);
				}

				const hasMovementCooldown =
					!!entity.enemy.movementCooldown && entity.enemy.movementCooldown >= 0;

				if (entity.enemy.type && !hasMovementCooldown) {
					const enemyBehavior = EnemyBehaviorFactory.create(entity.enemy.type);

					enemyBehavior.process(this.world, entity);
				}
				entity.enemy.iframes = Math.max(0, (entity.enemy.iframes ?? 0) - delta);

				if (hasMovementCooldown)
					entity.enemy.movementCooldown = Math.max(0, (entity.enemy.movementCooldown ?? 0) - delta);
			}
		});
	}
}
