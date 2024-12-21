import { BugComponents } from './types';

export const Ant: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true, tags: ['projectile', 'baby'] },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x609020,
		spriteKey: 'shieldBugSquare0',
		currentAnimation: 'shield-bug-walk-square'
	},
	enemy: {
		type: 'ant',
		health: 3,
		damage: 1,
		speed: 64
	}
};

export const Beetle: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x202060,
		spriteKey: 'beetleSquare0'
	},
	enemy: {
		type: 'beetle',
		health: 5,
		speed: 120
	}
};
