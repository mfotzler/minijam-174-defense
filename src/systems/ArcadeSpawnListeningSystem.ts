import { EventType, SpawnData, SpawnLocation, SpawnType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';

export default class ArcadeSpawnListeningSystem implements System {
	private static readonly INITIAL_SPAWN_BATCH_SIZE = 1;
	private static readonly SPAWN_BATCH_SIZE_GROWTH = 2;
	private static readonly SPAWN_BATCH_SIZE_LIMIT = 50;
	private static readonly TIME_BETWEEN_BATCHES = 30000;
	private static readonly TIME_BETWEEN_SPAWNS_IN_BATCH = 500;
	private static readonly INITIAL_BATCH_TIME = 5000;

	private timeToNextWave = ArcadeSpawnListeningSystem.INITIAL_BATCH_TIME;
	private currentBatchSize = ArcadeSpawnListeningSystem.INITIAL_SPAWN_BATCH_SIZE;
	private waveNumber = 1;

	async step(data: StepData) {
		this.timeToNextWave -= data.delta;

		this.broadcastHowLongUntilNextWave();

		if (this.isTimeToSpawn()) {
			this.processPostBatch();
			await this.spawnBatch();
		}
	}

	private broadcastHowLongUntilNextWave() {
		let timeInSeconds = Math.floor(this.timeToNextWave / 1000);
		MessageBus.sendMessage(EventType.WAVE_COUNTDOWN, timeInSeconds);
	}

	private isTimeToSpawn() {
		return this.timeToNextWave <= 0;
	}

	private async spawnBatch() {
		let batch = this.getBatchToSpawn();
		MessageBus.sendMessage(EventType.NEW_WAVE, this.waveNumber++);

		for (let i = 0; i < batch.length; i++) {
			await this.spawnBatchItem(batch[i]);
		}
	}

	private processPostBatch() {
		this.timeToNextWave = ArcadeSpawnListeningSystem.TIME_BETWEEN_BATCHES;
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
		let hasCentipede = false;

		for (let i = 0; i < batchSize; i++) {
			if (
				!hasCentipede &&
				batchSize > 3 &&
				i > batchSize - 3 &&
				Math.random() < this.currentBatchSize / 50
			) {
				batch.push({
					ticks: 0,
					type: 'centipede',
					location: 'north'
				});
				hasCentipede = true;
			} else {
				batch.push(this.makeRandomSpawn());
			}
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
