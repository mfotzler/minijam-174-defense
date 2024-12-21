import { BugComponents, Direction } from './types';

export const Player: BugComponents = {
	movement: {},
	input: {},
	render: {
		fillColor: 0x0000ff,
		width: 8,
		height: 8,
		spriteKey: 'mainCharacterSquare0',
		currentAnimation: 'player-walk-square'
	},
	player: { parts: [], shotCooldown: 0 },
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true },
	invincibility: {
		maxDuration: 1000
	}
};
