import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import GameOver from '../scenes/GameOver';

export type GameState = {
	level: number;
	score: number;
};

const getInitialState = (): GameState => ({
	level: 0,
	score: 0
});

export class GameStateSystem implements System {
	public static state: GameState = getInitialState();

	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.PLAYER_DEAD, () => {
			this.onPlayerDeath();
		});

		MessageBus.subscribe(EventType.GAME_OVER, this.onGameOver.bind(this));
	}

	private onGameOver() {
		this.scene.fadeToScene(GameOver.key, { fadeInDuration: 300 });
	}

	private onPlayerDeath() {
		this.scene.fadeToScene(GameOver.key, { fadeInDuration: 300 });
	}

	step() {}

	static clearState() {
		GameStateSystem.state = getInitialState();
	}
}
