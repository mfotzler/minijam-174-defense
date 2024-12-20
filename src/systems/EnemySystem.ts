import * as Phaser from 'phaser';
import { EntityDefinition } from '../engine/entities/types';
import { EventType, System } from '../engine/types';
import { BugComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import { cloneDeep } from 'lodash';
import { GameStateSystem } from './GameStateSystem';

export class EnemySystem implements System {
	constructor(
		scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const enemyEntity = world.entityProvider.getEntity(id);
			if (!playerEntity?.player || !enemyEntity?.enemy) return;

			MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: enemyEntity.enemy.damage });
		});

		MessageBus.subscribe(EventType.PROJECTILE_COLLISION, ({ id, damage }) => {
			const enemyEntity = world.entityProvider.getEntity(id);

			if (!enemyEntity?.enemy || enemyEntity.enemy.iframes > 0) return;

			enemyEntity.enemy.health = (enemyEntity.enemy.health ?? 1) - damage;
			enemyEntity.enemy.iframes = 20;
			// add flashing
			enemyEntity.render?.sprite?.setTintFill(0xffffff);
			for (let i = 1; i <= 5; i++) {
				scene.time.delayedCall(i * 50, () => {
					if (i % 2 === 0) {
						enemyEntity.render?.sprite?.setTintFill(0xffffff);
					} else {
						enemyEntity.render?.sprite?.clearTint();
					}
				});
			}

			if (enemyEntity.enemy.health <= 0) {
				MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
				MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_2' });
			} else {
				MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
			}
		});
	}

	step() {
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.enemy) {
				if (entity.collision.blocked?.down) {
					entity.render?.sprite?.body.setVelocityX(0);
				}
				if (entity.enemy.type) {
					enemyBehaviors[entity.enemy.type]?.(this.world, entity);
				}
				entity.enemy.iframes = Math.max(0, (entity.enemy.iframes ?? 0) - 1);
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
	carrot: (world: World, entity: EntityDefinition<BugComponents>) => {
		const { collision, render, enemy } = entity;
		const currentLevel = GameStateSystem.state.level;

		if (currentLevel === 0) {
			return;
		}

		const player = world.entityProvider.getEntity(world.playerId);

		if (!collision || !render?.sprite || !player) return;

		const distanceFromPlayerX = player?.render?.sprite?.transform.x - render?.sprite?.transform.x;
		const distanceFromPlayerY = player?.render?.sprite?.transform.y - render?.sprite?.transform.y;

		const totalDistance = Math.sqrt(distanceFromPlayerX ** 2 + distanceFromPlayerY ** 2);
		const cooldown = enemy?.shotCooldown ?? 0;

		if (cooldown > 0) {
			entity.enemy.shotCooldown = cooldown - 1;
			return;
		}

		// if (totalDistance < EnemySystem.CARROT_SHOOTING_RANGE) {
		// 	const angle = Math.atan2(distanceFromPlayerY, distanceFromPlayerX);
		// 	const velocity = EnemySystem.CARROT_SHOT_SPEED;

		// 	const peaClone = cloneDeep(Pea);

		// 	peaClone.movement.initialVelocity = {
		// 		x: Math.cos(angle) * velocity,
		// 		y: Math.sin(angle) * velocity
		// 	};

		// 	world.createEntity(peaClone, {
		// 		x: render?.sprite?.x,
		// 		y: render?.sprite?.y
		// 	});

		// 	entity.enemy.shotCooldown =
		// 		currentLevel === 1
		// 			? EnemySystem.CARROT_SHOT_COOLDOWN_EASY
		// 			: EnemySystem.CARROT_SHOT_COOLDOWN_HARD;
		// }
	}
};
