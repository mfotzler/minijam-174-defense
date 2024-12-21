import { IWeaponBehavior } from './WeaponBehaviorFactory';
import { World } from '../../world';
import { PlayerPart } from '../../entities/types';
import { Weapons } from '../../entities/Weapons';

export default class AntWeaponBehavior implements IWeaponBehavior {
	constructor(
		private world: World,
		private part: PlayerPart
	) {}

	shoot() {
		const { entityId, positionOffset } = this.part;
		const { render } = this.world.entityProvider.getEntity(entityId);

		const weapon = Weapons.larvae;

		const { speed, currentCooldown } = weapon.projectile;

		if (currentCooldown > 0) return;

		const startingPoint = {
			x: render.sprite.transform.x + this.part.positionOffset.x,
			y: render.sprite.transform.y + this.part.positionOffset.y
		};

		const angle = Math.floor(Math.random() * 360);

		const initialVelocity = {
			x: Math.cos(angle) * speed,
			y: Math.sin(angle) * speed
		};

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
}
