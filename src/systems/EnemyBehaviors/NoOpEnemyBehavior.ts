import { EntityDefinition } from '../../engine/entities/types';
import { BugComponents } from '../../entities/types';
import { World } from '../../world';
import { IEnemyBehavior } from './EnemyBehaviorFactory';

export default class NoOpEnemyBehavior implements IEnemyBehavior {
	process(world: World, entity: EntityDefinition<BugComponents>): void {}
}
