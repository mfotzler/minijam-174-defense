import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents, Direction } from '../../entities/types';
import { World } from '../../world';
import { IEnemyBehavior } from './EnemyBehaviorFactory';
import { cloneDeep } from 'lodash';
import { CentipedeSegment } from '../../entities/Enemies';
import EnemySpeedSystem from '../EnemySpeedSystem';

export default class CentipedeEnemyBehavior implements IEnemyBehavior {
	static readonly key = 'centipede';

	process(world: World, entity: EntityDefinition<BugComponents>): void {
		const { enemy, render, centipede } = entity;

		if (!enemy?.speed || !centipede || !render?.sprite) return;

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
		const speed = enemy.speed * EnemySpeedSystem.getCurrentSpeedMultiplier();

		if (centipede.direction === Direction.RIGHT) {
			render.sprite.body.setVelocityX(speed);
			render.sprite.body.setVelocityY(0);
			if (render.sprite.transform.x > 240) {
				centipede.direction = Direction.DOWN;
				centipede.turnDelay = 0;
				centipede.nextTurn = Direction.LEFT;
			}
		} else if (centipede.direction === Direction.LEFT) {
			render.sprite.body.setVelocityX(-speed);
			render.sprite.body.setVelocityY(0);
			if (render.sprite.transform.x < 16) {
				centipede.direction = Direction.DOWN;
				centipede.turnDelay = 0;
				centipede.nextTurn = Direction.RIGHT;
			}
		} else if (centipede.direction === Direction.DOWN) {
			render.sprite.body.setVelocityX(0);
			render.sprite.body.setVelocityY(speed);
			centipede.turnDelay = (centipede.turnDelay ?? 0) + 1;
			if (centipede.turnDelay > 12) {
				centipede.direction = centipede.nextTurn;
				enemy.stateTime = 0;
			}
		} // no up case

		render.sprite.transform.setRotation(
			Math.atan2(render.sprite.body.velocity.y, render.sprite.body.velocity.x) - Math.PI / 2
		);

		const segmentSpacing = 12;
		centipede.positions.push({ x: render.sprite.transform.x, y: render.sprite.transform.y });
		if (centipede.segments.length < 12 && enemy.stateTime % segmentSpacing === 0) {
			const segment = cloneDeep(CentipedeSegment);
			centipede.segments.push(world.createEntity(segment, centipede.positions[0]));
		}

		centipede.segments.forEach((id, i) => {
			const segment = world.entityProvider.getEntity(id);
			if (!segment.render?.sprite) return;

			const positionIndex = centipede.positions.length - (i + 1) * segmentSpacing;
			const { x, y } = centipede.positions[positionIndex] ?? { x: 0, y: 0 };
			const dx = x - segment.render.sprite.transform.x;
			const dy = y - segment.render.sprite.transform.y;
			segment.render.sprite.transform.setPosition(x, y);
			segment.render.sprite.transform.setRotation(Math.atan2(dy, dx) - Math.PI / 2);
		});
	}
}
