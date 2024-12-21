import { World } from '../../world';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import AntEnemyBehavior from './AntEnemyBehavior';
import BeetleEnemyBehavior from './BeetleEnemyBehavior';
import NoOpEnemyBehavior from './NoOpEnemyBehavior';

export interface IEnemyBehavior {
	process(world: World, entity: EntityDefinition<BugComponents>): void;
}

export default class EnemyBehaviorFactory {
	static create(type?: string): IEnemyBehavior {
		switch (type) {
			case 'ant':
				return new AntEnemyBehavior();
			case 'beetle':
				return new BeetleEnemyBehavior();
			default:
				return new NoOpEnemyBehavior();
		}
	}
}
