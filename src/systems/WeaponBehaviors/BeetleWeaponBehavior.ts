import { Acid } from '../../entities/Weapons';
import WeaponBehavior from './WeaponBehavior';

export default class BeetleWeaponBehavior extends WeaponBehavior {
	shoot() {
		this.defaultShoot(Acid);
	}
}
