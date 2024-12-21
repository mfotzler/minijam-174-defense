import * as Phaser from 'phaser';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import { World } from '../../world';
import { IEnemyBehavior } from './EnemyBehaviorFactory';

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

		if (closestPart.distance > 16) {
			render.sprite.body.setVelocityX(Math.cos(roundedAngle) * enemy.speed);
			render.sprite.body.setVelocityY(Math.sin(roundedAngle) * enemy.speed);
		} else {
			render.sprite.body.setVelocity(0, 0);
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	}
}
