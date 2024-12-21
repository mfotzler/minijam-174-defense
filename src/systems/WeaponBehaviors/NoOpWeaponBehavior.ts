import { IWeaponBehavior } from './WeaponBehaviorFactory';

export default class NoOpWeaponBehavior implements IWeaponBehavior {
	shoot() {}
}