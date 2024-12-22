import { BugComponents } from './types';

export const AntSmash: BugComponents = {
	movement: { hasGravity: false },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'antProjectile', scale: 1 },
	projectile: { type: 'antSmash', speed: 800, cooldown: 500, lifetime: 750, damage: 1 }
};

export const Acid: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true },
	render: { spriteKey: 'acid', width: 4, height: 4, fillColor: 0x90b040 },
	projectile: { type: 'acid', speed: 256, cooldown: 30, lifetime: 1000, damage: 1 }
};

export const Weapons = {
	antSmash: AntSmash,
	acid: Acid
};

export type WeaponType = keyof typeof Weapons;
