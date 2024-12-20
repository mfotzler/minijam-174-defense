import { BugComponents } from './types';

export const FrostingShot: BugComponents = {
	movement: { hasGravity: true },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'frosting', scale: 2 },
	projectile: { type: 'frosting', speed: 800, cooldown: 30, lifetime: 750 }
};

export const Weapons = {
	frosting: FrostingShot
};

export type WeaponType = keyof typeof Weapons;
