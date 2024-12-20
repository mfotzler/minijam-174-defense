import { BugComponents, Direction } from './types';

export const Corpse: BugComponents = {
	isCorpse: true,
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 16,
		height: 16,
		fillColor: 0xff4400
	}
};
