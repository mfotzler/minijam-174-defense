import { EventType, SpawnData, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';
import { BugComponents } from '../entities/types';
import { Ant, Beetle } from '../entities/Enemies';

type Coordinate = {
	x: number;
	y: number;
};

export default class EnemySpawnSystem implements System {
	private readonly coordinates: Record<string, Coordinate> = {
		north: {
			x: 126,
			y: 0
		},
		south: {
			x: 126,
			y: 256
		},
		east: {
			x: 256,
			y: 126
		},
		west: {
			x: 0,
			y: 126
		}
	};

	private readonly enemyTypes: Record<string, BugComponents> = {
		ant: Ant,
		beetle: Beetle
	};

	constructor(private world: World) {
		MessageBus.subscribe(EventType.SPAWN_ENEMY, this.spawnEnemy.bind(this));
	}

	private spawnEnemy(data: SpawnData) {
		let { x, y } = this.coordinates[data.location];
		let enemy = this.enemyTypes[data.type];

		this.world.createEntity(enemy, { x, y });
	}

	step(data: StepData) {}
}
