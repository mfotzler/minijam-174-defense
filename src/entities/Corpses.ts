import { BugComponents, Direction } from './types';

export const AntCorpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0xff4400
	},
	corpse: {
		weaponType: 'larvae'
	}
};

export const BeetleCorpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { player: true },
	render: {
		width: 8,
		height: 8,
		fillColor: 0x6791ac
	},
	corpse: {
		weaponType: 'acid'
	}
};
