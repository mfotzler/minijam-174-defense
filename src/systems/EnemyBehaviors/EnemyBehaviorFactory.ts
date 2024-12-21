import { World } from '../../world';
import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import AntEnemyBehavior from './AntEnemyBehavior';
import BeetleEnemyBehavior from './BeetleEnemyBehavior';
import NoOpEnemyBehavior from './NoOpEnemyBehavior';
import BabyEaterAntBehavior from './BabyEaterAntBehavior';

export interface IEnemyBehavior {
	process(world: World, entity: EntityDefinition<BugComponents>): void;
}

export default class EnemyBehaviorFactory {
	static create(type?: string): IEnemyBehavior {
		switch (type) {
			case AntEnemyBehavior.key:
				return new AntEnemyBehavior();
			case BeetleEnemyBehavior.key:
				return new BeetleEnemyBehavior();
			case BabyEaterAntBehavior.key:
				return new BabyEaterAntBehavior();
			default:
				return new NoOpEnemyBehavior();
		}
	}
}
