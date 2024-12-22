import * as Phaser from 'phaser';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import { World } from '../../world';
import { IEnemyBehavior } from './EnemyBehaviorFactory';
import { cloneDeep } from 'lodash';
import { Acid } from '../../entities/Weapons';
import EnemySpeedSystem from '../EnemySpeedSystem';

export default class BeetleEnemyBehavior implements IEnemyBehavior {
	static readonly key = 'beetle';

	process(world: World, entity: EntityDefinition<BugComponents>): void {
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

		const speed = enemy.speed * EnemySpeedSystem.getCurrentSpeedMultiplier();

		render.sprite.body.setVelocity(Math.cos(moveAngle) * speed, Math.sin(moveAngle) * speed);

		this.setRotation(render, moveAngle);

		// we move for 60 frames before shooting
		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
		if (enemy.stateTime < 60) return;

		enemy.stateTime = 0;

		render.sprite.body.setVelocity(0, 0);
		this.setRotation(render, angle);

		const acid = cloneDeep(Acid);

		acid.movement.initialVelocity = {
			x: Math.cos(angle) * acid.projectile?.speed,
			y: Math.sin(angle) * acid.projectile?.speed
		};

		acid.enemy = {
			damage: 1
		};

		world.createEntity(acid, {
			x: render?.sprite?.transform.x,
			y: render?.sprite?.transform.y
		});

		entity.enemy.shotCooldown = acid.projectile.cooldown;
	}

	private setRotation(render: BugComponents['render'], angle: number) {
		const roundedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
		if ((roundedAngle + 0.01) % (Math.PI / 2) > 0.02) {
			render.currentAnimation = 'beetle-walk-angle';
			render.sprite.transform.setRotation(roundedAngle - Math.PI / 4);
		} else {
			render.currentAnimation = 'beetle-walk-square';
			render.sprite.transform.setRotation(roundedAngle - Math.PI / 2);
		}
	}
}
