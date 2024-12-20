import { BugComponents, Direction } from './types';

export const Player: BugComponents = {
	player: { currentWeapon: 'frosting', shotCooldown: 0, iframes: 0 },
	position: { x: 350, y: 1000 },
	movement: { hasGravity: true },
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true },
	render: {
		width: 16,
		height: 16,
		fillColor: 0x00ff00
	},
	input: {}
};
