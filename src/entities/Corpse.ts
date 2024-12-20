import { BugComponents, Direction } from './types';

export const Corpse: BugComponents = {
	movement: {},
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true },
	render: {
		width: 16,
		height: 16,
		fillColor: 0xff4400
	}
};
