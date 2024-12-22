import { EventType, SpawnData, SpawnLocation, SpawnType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';

export default class ArcadeSpawnListeningSystem implements System {
	private static readonly INITIAL_SPAWN_BATCH_SIZE = 1;
	private static readonly SPAWN_BATCH_SIZE_GROWTH = 2;
	private static readonly SPAWN_BATCH_SIZE_LIMIT = 50;
	private static readonly TIME_BETWEEN_BATCHES = 30000;
	private static readonly TIME_BETWEEN_SPAWNS_IN_BATCH = 500;
	private static readonly INITIAL_BATCH_TIME = 5000;

	private elapsedTicks = ArcadeSpawnListeningSystem.INITIAL_BATCH_TIME;
	private currentBatchSize = ArcadeSpawnListeningSystem.INITIAL_SPAWN_BATCH_SIZE;

	async step(data: StepData) {
		this.elapsedTicks -= data.delta;

		if (this.isTimeToSpawn()) {
			this.processPostBatch();
			await this.spawnBatch();
		}
	}

	private isTimeToSpawn() {
		return this.elapsedTicks <= 0;
	}

	private async spawnBatch() {
		let batch = this.getBatchToSpawn();

		for (let i = 0; i < batch.length; i++) {
			await this.spawnBatchItem(batch[i]);
		}
	}

	private processPostBatch() {
		this.elapsedTicks = ArcadeSpawnListeningSystem.TIME_BETWEEN_BATCHES;
		this.currentBatchSize = Math.min(
			this.currentBatchSize + ArcadeSpawnListeningSystem.SPAWN_BATCH_SIZE_GROWTH,
			ArcadeSpawnListeningSystem.SPAWN_BATCH_SIZE_LIMIT
		);
	}

	private async spawnBatchItem(data: SpawnData): Promise<any> {
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve({});
			}, ArcadeSpawnListeningSystem.TIME_BETWEEN_SPAWNS_IN_BATCH);
		});
		MessageBus.sendMessage(EventType.SPAWN_ENEMY, data);
	}

	private getBatchToSpawn(): SpawnData[] {
		const batch: SpawnData[] = [];
		const batchSize = this.currentBatchSize;

		for (let i = 0; i < batchSize; i++) {
			batch.push(this.makeRandomSpawn());
		}

		return batch;
	}

	private makeRandomSpawn(): SpawnData {
		const directions: SpawnLocation[] = ['north', 'south', 'east', 'west'];
		const ticks = 0;
		const types: SpawnType[] = ['ant', 'beetle', 'babyEaterAnt'];

		return {
			ticks,
			type: types[Math.floor(Math.random() * types.length)],
			location: directions[Math.floor(Math.random() * directions.length)]
		};
	}
}
