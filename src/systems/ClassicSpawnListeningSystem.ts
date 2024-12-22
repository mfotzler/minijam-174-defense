import { EventType, SpawnData, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { cloneDeep } from 'lodash';

export default class ClassicSpawnListeningSystem implements System {
	private elapsedTicks = 0;
	private data: SpawnData[];
	private spawnedIndexes: number[] = [];
	private nextSpawnIndex: number;

	private infiniteSpawnMode = false;
	constructor(level: number = 1) {
		fetch(`/assets/levels/enemies_level_${level}.json`)
			.then((res) => res.json())
			.then((json) => {
				this.data = this.expandData(json.spawns);
				this.getNextSpawnIndex();
			});

		MessageBus.subscribe(EventType.ENABLE_INFINITE_MODE, (shouldBeEnabled: boolean) => {
			this.infiniteSpawnMode = shouldBeEnabled;

			if (shouldBeEnabled) MessageBus.sendMessage(EventType.ALL_ENEMIES_SPAWNED, false);

			this.resetData();
		});
	}

	expandData(data: SpawnData[]): SpawnData[] {
		let result: SpawnData[] = [];

		for (const spawn of data) {
			let count = spawn.count || 1;

			for (let i = 0; i < count; i++) {
				let offset = i * 50;

				let ticks = spawn.ticks + offset;

				result.push({ ...cloneDeep(spawn), ticks, count: 1 });
			}
		}

		return result;
	}

	step(data: StepData) {
		this.elapsedTicks += data.delta;

		if (this.isSpawnTime()) {
			this.spawn();
		}

		this.checkIfShouldResetData();
	}

	private spawn() {
		let spawn = this.data[this.nextSpawnIndex];
		this.spawnedIndexes.push(this.nextSpawnIndex);

		MessageBus.sendMessage(EventType.SPAWN_ENEMY, spawn);

		this.getNextSpawnIndex();
	}

	private isSpawnTime() {
		if (!this.nextSpawnIndex && this.nextSpawnIndex !== 0 && this.nextSpawnIndex !== -1)
			return false;

		let spawn = this.data[this.nextSpawnIndex];

		if (!spawn || !spawn.ticks) return false;

		return spawn.ticks <= this.elapsedTicks;
	}

	private getNextSpawnIndex() {
		if (!this.data) return;

		let nextSpawnTick = this.data
			.sort((a, b) => a.ticks - b.ticks)
			.find((spawn) => spawn.ticks > this.elapsedTicks);

		this.nextSpawnIndex = this.data.findIndex((spawn, index, array) => {
			if (this.spawnedIndexes.includes(index)) return false;

			return spawn?.ticks === nextSpawnTick?.ticks;
		});

		if (this.nextSpawnIndex === -1) {
			MessageBus.sendMessage(EventType.ALL_ENEMIES_SPAWNED, true);
		}
	}

	private checkIfShouldResetData() {
		if (this.infiniteSpawnMode && this.spawnedIndexes.length === this.data.length) {
			this.resetData();
		}
	}

	private resetData() {
		this.elapsedTicks = 0;
		this.spawnedIndexes = [];
		this.nextSpawnIndex = 0;
	}
}
