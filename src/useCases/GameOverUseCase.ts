import BaseScene from '../scenes/BaseScene';
import GameOver from '../scenes/GameOver';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class GameOverUseCase {
	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.PLAYER_DEAD, this.onGameOver.bind(this));
		MessageBus.subscribe(EventType.GAME_OVER, this.onGameOver.bind(this));
	}

	private onGameOver() {
		this.scene.fadeToScene(GameOver.key, { fadeInDuration: 300 });
	}
}
