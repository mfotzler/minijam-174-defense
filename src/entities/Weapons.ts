import { BugComponents } from './types';

export const LarvaeShot: BugComponents = {
	movement: { hasGravity: false },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'larvae', scale: 2 },
	projectile: { type: 'larvae', speed: 800, cooldown: 30, lifetime: 750, damage: 1 }
};

export const Weapons = {
	larvae: LarvaeShot
};

export type WeaponType = keyof typeof Weapons;
