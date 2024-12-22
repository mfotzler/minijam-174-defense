import * as Phaser from 'phaser';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import { World } from '../../world';
import { IEnemyBehavior } from './EnemyBehaviorFactory';
import EnemySpeedSystem from '../EnemySpeedSystem';

export default class AntEnemyBehavior implements IEnemyBehavior {
	static readonly key = 'ant';

	process(world: World, entity: EntityDefinition<BugComponents>): void {
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

		const speed = enemy.speed * EnemySpeedSystem.getCurrentSpeedMultiplier();

		if (closestPart.distance > 16) {
			render.sprite.body.setVelocityX(Math.cos(roundedAngle) * speed);
			render.sprite.body.setVelocityY(Math.sin(roundedAngle) * speed);
		} else {
			render.sprite.body.setVelocity(0, 0);
		}

		if (
			Math.abs(render.sprite.body.velocity.x) > 0.01 &&
			Math.abs(render.sprite.body.velocity.y) > 0.01
		) {
			entity.render.currentAnimation = 'ant-walk-angle';
			render.sprite.transform.setRotation(roundedAngle + (3 * Math.PI) / 4);
		} else {
			entity.render.currentAnimation = 'ant-walk-square';
			render.sprite.transform.setRotation(roundedAngle + Math.PI / 2);
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	}
}
