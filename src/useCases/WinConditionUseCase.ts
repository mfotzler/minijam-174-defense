import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import GameWon from '../scenes/GameWon';

export default class WinConditionUseCase {
	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.ALL_ENEMIES_KILLED, this.onAllEnemiesKilled.bind(this));
	}

	private onAllEnemiesKilled() {
		this.showWinScreen();
	}

	private showWinScreen() {
		this.scene.fadeToScene(GameWon.key);
	}
}
