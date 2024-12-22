import * as Phaser from 'phaser';
import { IEnemyBehavior } from './EnemyBehaviorFactory';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import { World } from '../../world';
import EnemySpeedSystem from '../EnemySpeedSystem';

export default class BabyEaterAntBehavior implements IEnemyBehavior {
	static readonly key = 'babyEaterAnt';

	process(world: World, entity: EntityDefinition<BugComponents>) {
		const { enemy, render } = entity;
		const babies = world.entityProvider.entities.filter((e) => !!e.baby);

		if (!enemy?.speed || !render?.sprite || !babies) return;

		const closestBaby = babies.reduce(
			(closest, baby) => {
				const distance = Phaser.Math.Distance.BetweenPoints(
					render.sprite.transform,
					baby.render.sprite.transform
				);
				return distance < closest.distance ? { distance, baby } : closest;
			},
			{ distance: Infinity, baby: null }
		);

		if (!closestBaby.baby) return;

		const angle = Phaser.Math.Angle.BetweenPoints(
			render.sprite.transform,
			closestBaby.baby.render.sprite.transform
		);

		const speed = enemy.speed * EnemySpeedSystem.getCurrentSpeedMultiplier();

		if (closestBaby.distance > 4) {
			render.sprite.body.setVelocityX(Math.cos(angle) * speed);
			render.sprite.body.setVelocityY(Math.sin(angle) * speed);
		} else {
			render.sprite.body.setVelocity(0, 0);
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	}
}
