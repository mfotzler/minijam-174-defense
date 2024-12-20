import { BugComponents, Direction } from './types';

export const Player: BugComponents = {
	movement: {},
	input: {},
	render: {
		fillColor: 0x0000ff,
		width: 32,
		height: 32
	},
	player: { parts: [] },
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true }
};
