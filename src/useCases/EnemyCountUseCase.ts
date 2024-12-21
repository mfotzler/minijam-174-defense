import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class EnemyCountUseCase {
	private enemiesDoneSpawning: boolean = false;
	private enemies: number = 0;

	constructor() {
		MessageBus.subscribe(EventType.SPAWN_ENEMY, this.onEnemySpawned.bind(this));
		MessageBus.subscribe(EventType.KILL_ENEMY, this.onEnemyKilled.bind(this));
		MessageBus.subscribe(EventType.ALL_ENEMIES_SPAWNED, this.onEnemyDoneSpawning.bind(this));
	}

	private onEnemySpawned() {
		this.enemies++;
	}

	private onEnemyKilled() {
		this.enemies--;

		if (this.enemies <= 0 && this.enemiesDoneSpawning) {
			MessageBus.sendMessage(EventType.ALL_ENEMIES_KILLED, true);
		}
	}

	private onEnemyDoneSpawning(value: boolean) {
		this.enemiesDoneSpawning = value;
	}
}
