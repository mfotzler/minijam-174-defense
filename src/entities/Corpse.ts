import { BugComponents, Direction } from './types';

export const Corpse: BugComponents = {
	isCorpse: true,
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0xff4400,
		spriteKey: 'beetleSquare3'
	}
};
