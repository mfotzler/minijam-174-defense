import { System, EventType, StepData } from '../engine/types';
import { WeaponType, Weapons } from '../entities/Weapons';
import { BugComponents, Direction, PlayerPart } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';
import { WeaponBehaviorFactory } from './WeaponBehaviors/WeaponBehaviorFactory';

export class WeaponSystem implements System {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_SHOOT, this.onPlayerShoot.bind(this));
	}

	private onPlayerShoot() {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);

		const weaponBehaviorFactory = new WeaponBehaviorFactory(this.world);

		for (const part of playerEntity.player.parts) {
			const weapon = weaponBehaviorFactory.Create(part);

			weapon.shoot();
		}
		this.setCooldownsForAllWeapons();
	}

	private setCooldownsForAllWeapons() {
		for (const weapon of Object.values(Weapons)) {
			if (
				weapon.projectile &&
				(weapon.projectile.currentCooldown <= 0 || !weapon.projectile.currentCooldown)
			) {
				weapon.projectile.currentCooldown = weapon.projectile.cooldown;
			}
		}
	}

	step(data: StepData) {
		const weapons = Object.values(Weapons);

		for (const weapon of weapons) {
			if (!weapon.projectile) continue;

			weapon.projectile.currentCooldown = Math.max(
				0,
				weapon.projectile.currentCooldown - data.delta
			);
		}
	}
}
