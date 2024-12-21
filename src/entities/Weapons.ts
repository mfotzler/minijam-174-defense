import { BugComponents } from './types';

export const LarvaeShot: BugComponents = {
	movement: { hasGravity: false },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'larvae', scale: 2 },
	projectile: { type: 'larvae', speed: 800, cooldown: 30, lifetime: 750, damage: 1 }
};

export const Acid: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true },
	render: { spriteKey: 'larvae0', width: 4, height: 4, fillColor: 0x90b040 },
	projectile: { type: 'acid', speed: 256, cooldown: 30, lifetime: 1000, damage: 1 }
};

export const Weapons = {
	larvae: LarvaeShot,
	acid: Acid
};

export type WeaponType = keyof typeof Weapons;
