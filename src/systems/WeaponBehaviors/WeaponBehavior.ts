import { IWeaponBehavior } from './WeaponBehaviorFactory';
import { Point, World } from '../../world';
import { BugComponents, PlayerPart } from '../../entities/types';
import * as Phaser from 'phaser';
import { Weapons } from '../../entities/Weapons';

export default abstract class WeaponBehavior implements IWeaponBehavior {
	constructor(
		protected world: World,
		protected part: PlayerPart
	) {}

	abstract shoot(): void;

	protected defaultShoot(weapon: BugComponents): void {
		const startingPoint = this.getStartingPoint();

		const { entityId } = this.part;
		const { render } = this.world.entityProvider.getEntity(entityId);

		if (this.isOnCooldown(weapon)) return;

		const angle = this.getAngleBasedOnTwoPoints(render.sprite.transform, startingPoint);

		const initialVelocity = this.calculateInitialVelocity(weapon, angle);

		this.world.createEntity(
			{
				...weapon,
				movement: {
					...weapon.movement,
					initialVelocity
				}
			},
			startingPoint
		);
	}

	protected getStartingPoint(): Point {
		const { entityId, positionOffset } = this.part;
		const { render } = this.world.entityProvider.getEntity(entityId);
		return {
			x: render.sprite.transform.x + this.part.positionOffset.x,
			y: render.sprite.transform.y + this.part.positionOffset.y
		};
	}

	protected isOnCooldown(weapon: BugComponents): boolean {
		if (!weapon.projectile) return false;

		const { currentCooldown } = weapon.projectile;
		return currentCooldown > 0;
	}

	protected calculateInitialVelocity(weapon: BugComponents, angle: number): Point {
		const { speed } = weapon.projectile;
		return {
			x: Math.cos(angle) * speed,
			y: Math.sin(angle) * speed
		};
	}

	protected getAngleBasedOnTwoPoints(start: Point, end: Point): number {
		return Phaser.Math.Angle.BetweenPoints(start, end);
	}
}
