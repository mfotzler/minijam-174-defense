import * as Phaser from 'phaser';
import { EntityDefinition } from '../engine/entities/types';
import { EventType, System } from '../engine/types';
import { BugComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import { cloneDeep } from 'lodash';
import { GameStateSystem } from './GameStateSystem';
import { Corpse } from '../entities/Corpse';
import { Acid } from '../entities/Weapons';

export class EnemySystem implements System {
	constructor(
		private scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, this.onPlayerCollision.bind(this));
		MessageBus.subscribe(EventType.PROJECTILE_COLLISION, this.onProjectileCollision.bind(this));
		MessageBus.subscribe(EventType.KILL_ENEMY, this.onKillEnemy.bind(this));
		MessageBus.subscribe(EventType.SPAWN_CORPSE, this.onSpawnCorpse.bind(this));
		MessageBus.subscribe(EventType.PLAYER_PART_COLLISION, this.onPartCollision.bind(this));
	}
	
	private onPartCollision({entityId, partId}: {entityId: string; partId: string;}) {
		const entity = this.world.entityProvider.getEntity(entityId);
		const part = this.world.entityProvider.getEntity(partId);
		
		if(!entity || !part || !entity.enemy) return;
		
		MessageBus.sendMessage(EventType.PLAYER_PART_DESTROY, {partId: partId});
	}

	private onPlayerCollision({ id }: { id: string }) {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		const enemyEntity = this.world.entityProvider.getEntity(id);

		if (!playerEntity?.player || !enemyEntity?.enemy) return;

		MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: enemyEntity.enemy.damage });
	}

	private onProjectileCollision({ id, damage }: { id: string; damage: number }) {
		const enemyEntity = this.world.entityProvider.getEntity(id);

		if (!enemyEntity?.enemy || enemyEntity.enemy.iframes > 0) return;

		enemyEntity.enemy.health = (enemyEntity.enemy.health ?? 1) - damage;
		enemyEntity.enemy.iframes = 20;

		this.flashEnemy(enemyEntity, this.scene);

		if (enemyEntity.enemy.health <= 0) {
			MessageBus.sendMessage(EventType.KILL_ENEMY, { entityId: id });
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_2' });
		} else {
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
		}
	}

	private onKillEnemy({ entityId }: { entityId: string }) {
		const entity = this.world.entityProvider.getEntity(entityId);
		if (!entity?.enemy) return;

		MessageBus.sendMessage(EventType.SPAWN_CORPSE, entity);
		MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId });
	}

	private onSpawnCorpse(entity: EntityDefinition<BugComponents>) {
		this.world.createEntity(Corpse, entity.render?.sprite?.transform ?? { x: 0, y: 0 });
	}

	private flashEnemy(enemyEntity: BugComponents & { id: string }, scene: BaseScene) {
		this.setTint(enemyEntity, 0xff0000);
		for (let i = 1; i <= 5; i++) {
			scene.time.delayedCall(i * 50, () => {
				if (i % 2 === 0) {
					this.setTint(enemyEntity, 0xff0000);
				} else {
					this.setTint(enemyEntity, 0xffffff);
				}
			});
		}
	}

	private setTint(entity: EntityDefinition<BugComponents>, color: number) {
		entity.render.fillColor = color;
	}

	step({delta}) {
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.enemy) {
				if (entity.collision.blocked?.down) {
					entity.render?.sprite?.body.setVelocityX(0);
				}
				
				const hasMovementCooldown = !!entity.enemy.movementCooldown && entity.enemy.movementCooldown >= 0;
				
				if (entity.enemy.type && !hasMovementCooldown) {
					enemyBehaviors[entity.enemy.type]?.(this.world, entity);
				}
				entity.enemy.iframes = Math.max(0, (entity.enemy.iframes ?? 0) - delta);
				
				if(hasMovementCooldown)
					entity.enemy.movementCooldown = Math.max(0, (entity.enemy.movementCooldown ?? 0) - delta);
			}
		});
	}
}

const enemyBehaviors = {
	ant: (world: World, entity: EntityDefinition<BugComponents>) => {
		const { enemy, render } = entity;
		const player = world.entityProvider.getEntity(world.playerId);

		if (!enemy?.speed || !render?.sprite || !player) return;

		const closestPart = player.player?.parts.reduce(
			(closest, part) => {
				const partEntity = world.entityProvider.getEntity(part.entityId);
				if (!partEntity?.render?.sprite) return closest;

				const distance = Phaser.Math.Distance.BetweenPointsSquared(
					render.sprite.transform,
					partEntity.render.sprite.transform
				);
				return distance < closest.distance ? { distance, partEntity } : closest;
			},
			{ distance: Infinity, partEntity: player }
		);

		// get vector to closest part, rounded to 45 degrees
		const dx = closestPart.partEntity.render.sprite.transform.x - render.sprite.transform.x;
		const dy = closestPart.partEntity.render.sprite.transform.y - render.sprite.transform.y;
		const angle = Math.atan2(dy, dx);
		const roundedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

		if (closestPart.distance > 16) {
			render.sprite.body.setVelocityX(Math.cos(roundedAngle) * enemy.speed);
			render.sprite.body.setVelocityY(Math.sin(roundedAngle) * enemy.speed);
		} else {
			render.sprite.body.setVelocity(0, 0);
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	},
	beetle: (world: World, entity: EntityDefinition<BugComponents>) => {
		const { enemy, render } = entity;
		const player = world.entityProvider.getEntity(world.playerId);

		if (!enemy?.speed || !render?.sprite || !player) return;

		// just sit still after the shot before moving again
		const cooldown = enemy?.shotCooldown ?? 0;
		if (cooldown > 0) {
			enemy.shotCooldown = cooldown - 1;
			return;
		}

		// now we can move
		const angle = Phaser.Math.Angle.BetweenPoints(
			render.sprite.transform,
			player.render.sprite.transform
		);
		const playerDistance = Phaser.Math.Distance.BetweenPoints(
			render.sprite.transform,
			player.render.sprite.transform
		);
		let moveAngleOffset = Math.PI / 2;
		if (playerDistance > 64) {
			moveAngleOffset = Math.PI / 4;
		} else if (playerDistance < 32) {
			moveAngleOffset = (Math.PI * 3) / 4;
		}
		const moveAngle = angle + moveAngleOffset;

		render.sprite.body.setVelocity(
			Math.cos(moveAngle) * enemy.speed,
			Math.sin(moveAngle) * enemy.speed
		);

		// we move for 60 frames before shooting
		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
		if (enemy.stateTime < 60) return;

		enemy.stateTime = 0;

		render.sprite.body.setVelocity(0, 0);

		const acid = cloneDeep(Acid);

		acid.movement.initialVelocity = {
			x: Math.cos(angle) * acid.projectile?.speed,
			y: Math.sin(angle) * acid.projectile?.speed
		};

		world.createEntity(acid, {
			x: render?.sprite?.transform.x,
			y: render?.sprite?.transform.y
		});

		entity.enemy.shotCooldown = acid.projectile.cooldown;
	}
};
