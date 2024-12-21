import { BugComponents } from './types';

export const Baby: BugComponents = {
	baby: {
		health: 5
	},
	movement: {},
	collision: {},
	render: {
		width: 4,
		height: 4,
		fillColor: 0x69420e,
		spriteKey: 'larvae0',
		currentAnimation: 'larvae-wiggle'
	},
	invincibility: {
		maxDuration: 1000
	}
};
