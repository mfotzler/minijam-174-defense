import { AntSmash } from '../../entities/Weapons';
import WeaponBehavior from './WeaponBehavior';

export default class AntWeaponBehavior extends WeaponBehavior {
	shoot() {
		this.defaultShoot(AntSmash);
	}
}
