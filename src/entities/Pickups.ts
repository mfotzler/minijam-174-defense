import { BugComponents, Direction } from './types';

export const SprinkeShotPickup: BugComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteSheet: 'sprinkle', scale: 4, currentAnimation: 'sprinkle-spin' },
	weaponPickup: { weaponType: 'sprinkle' }
};

export const CoinShotPickup: BugComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteSheet: 'coin', scale: 4, currentAnimation: 'coin-spin' },
	weaponPickup: { weaponType: 'coin' }
};

export const Grandma: BugComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true, tags: ['grandma'] },
	render: { spriteKey: 'grandma1', scale: 0.25 },
	facing: { direction: Direction.LEFT }
};
