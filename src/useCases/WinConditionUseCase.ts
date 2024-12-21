import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import GameWon from '../scenes/GameWon';

export default class WinConditionUseCase {
	private isInfiniteMode = false;

	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.ALL_ENEMIES_KILLED, this.onAllEnemiesKilled.bind(this));
		MessageBus.subscribe(EventType.ENABLE_INFINITE_MODE, this.onIsInfiniteMode.bind(this));
	}

	private onAllEnemiesKilled() {
		if (!this.isInfiniteMode) this.showWinScreen();
	}

	private onIsInfiniteMode(value: boolean) {
		this.isInfiniteMode = value;
	}

	private showWinScreen() {
		this.scene.fadeToScene(GameWon.key);
	}
}
