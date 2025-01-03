import { BugComponents, Direction } from './types';

export const AntCorpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0xff4400,
		spriteKey: 'shieldBugSquare3',
		angledSpriteKey: 'shieldBugAngle3'
	},
	corpse: {
		weaponType: 'antSmash',
		maxHealth: 10
	},
	invincibility: {
		maxDuration: 500
	}
};

export const BabyEaterAntCorpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0xff4400,
		spriteKey: 'babyEaterSquare3',
		angledSpriteKey: 'babyEaterAngle3'
	},
	corpse: {
		weaponType: 'antSmash',
		maxHealth: 10
	},
	invincibility: {
		maxDuration: 500
	}
};

export const BeetleCorpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x6791ac,
		spriteKey: 'beetleSquare3',
		angledSpriteKey: 'beetleAngle3'
	},
	corpse: {
		weaponType: 'acid',
		maxHealth: 5
	},
	invincibility: {
		maxDuration: 500
	}
};
