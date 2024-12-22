import { World } from '../../world';
import { PlayerPart } from '../../entities/types';
import AntWeaponBehavior from './AntWeaponBehavior';
import NoOpWeaponBehavior from './NoOpWeaponBehavior';
import BeetleWeaponBehavior from './BeetleWeaponBehavior';

export interface IWeaponBehavior {
	shoot(): void;
}

export class WeaponBehaviorFactory {
	constructor(private world: World) {}

	Create(part: PlayerPart): IWeaponBehavior {
		const entity = this.world.entityProvider.getEntity(part.entityId);

		const weaponType = entity?.corpse?.weaponType;

		switch (weaponType) {
			case 'antSmash':
				return new AntWeaponBehavior(this.world, part);
			case 'acid':
				return new BeetleWeaponBehavior(this.world, part);
			default:
				return new NoOpWeaponBehavior();
		}
	}
}
