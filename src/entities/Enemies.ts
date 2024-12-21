import { BugComponents } from './types';

export const Ant: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {
	},
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: { width: 8, height: 8, fillColor: 0x609020 },
	enemy: {
		type: 'ant',
		health: 3,
		damage: 1,
		speed: 64
	},
		
};
