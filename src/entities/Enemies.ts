import { BugComponents, Direction } from './types';
import AntEnemyBehavior from '../systems/EnemyBehaviors/AntEnemyBehavior';
import BabyEaterAntBehavior from '../systems/EnemyBehaviors/BabyEaterAntBehavior';
import BeetleEnemyBehavior from '../systems/EnemyBehaviors/BeetleEnemyBehavior';

const AntBase: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { tiles: true, player: true, tags: ['projectile', 'baby'] },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x609020,
		spriteKey: 'shieldBugSquare0',
		currentAnimation: 'ant-walk-square'
	},
	enemy: {
		type: 'PLACEHOLDER',
		health: 20,
		damage: 3,
		speed: 64,
		corpseType: 'ant'
	},
	invincibility: {
		maxDuration: 250
	}
};

export const Ant: BugComponents = {
	...AntBase,
	enemy: {
		...AntBase.enemy,
		type: AntEnemyBehavior.key
	}
};

export const BabyEaterAnt: BugComponents = {
	...AntBase,
	enemy: {
		...AntBase.enemy,
		damage: 3,
		type: BabyEaterAntBehavior.key,
		corpseType: 'babyEaterAnt',
		health: 20
	},
	render: {
		...AntBase.render,
		fillColor: 0x902060,
		spriteKey: 'babyEaterSquare0',
		currentAnimation: 'baby-eater-walk-square'
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
		spriteKey: 'beetleSquare0',
		currentAnimation: 'beetle-walk-square'
	},
	enemy: {
		type: BeetleEnemyBehavior.key,
		health: 10,
		speed: 120,
		corpseType: 'beetle',
		damage: 3
	},
	invincibility: {
		maxDuration: 250
	}
};

export const CentipedeHead: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { player: true, tags: ['projectile', 'baby'] },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x40ff00,
		spriteKey: 'centipedeHeadSquare0',
		currentAnimation: 'centipede-head-square'
	},
	enemy: {
		type: 'centipede',
		health: 50,
		speed: 160,
		corpseType: ''
	},
	centipede: {
		segments: [],
		positions: [],
		direction: Direction.RIGHT,
		nextTurn: Direction.LEFT
	},
	invincibility: {
		maxDuration: 200
	}
};

export const CentipedeSegment: BugComponents = {
	position: { x: 0, y: 0 },
	movement: {},
	collision: { player: true, tags: ['projectile'] },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x40ff00,
		spriteKey: 'centipedeBodySquare0',
		currentAnimation: 'centipede-body-square'
	},
	enemy: {
		health: 20,
		corpseType: ''
	},
	invincibility: {
		maxDuration: 200
	}
};
