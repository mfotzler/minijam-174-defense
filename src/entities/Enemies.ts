import { BugComponents, Direction } from './types';

export const Ant: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true, tags: ['projectile', 'baby'] },
	render: { width: 8, height: 8, fillColor: 0x609020 },
	enemy: {
		type: 'ant',
		health: 3,
		damage: 1,
		speed: 64
	},
	invincibility: {
		maxDuration: 250
	}
};

export const Beetle: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: { width: 8, height: 8, fillColor: 0x202060 },
	enemy: {
		type: 'beetle',
		health: 5,
		speed: 120
	}
};

export const CentipedeHead: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { player: true },
	render: { width: 8, height: 8, fillColor: 0x40ff00 },
	enemy: {
		type: 'centipedehead',
		health: 10,
		speed: 96
	},
	centipede: {
		segments: [],
		positions: [],
		direction: Direction.RIGHT,
		nextTurn: Direction.LEFT
	}
};

export const CentipedeSegment: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { player: true },
	render: { width: 8, height: 8, fillColor: 0x40ff00 },
	enemy: {
		type: 'centipedesegment',
		health: 5
	}
};
