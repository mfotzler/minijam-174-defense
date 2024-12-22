import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class ScoreTrackingUseCase {
	public static currentScore: number = 0;

	constructor() {
		ScoreTrackingUseCase.currentScore = 0;

		MessageBus.subscribe(EventType.KILL_ENEMY, this.onEnemyKilled.bind(this));
	}

	private onEnemyKilled() {
		ScoreTrackingUseCase.currentScore += 1;

		MessageBus.sendMessage(EventType.SCORE_UPDATED, ScoreTrackingUseCase.currentScore);
	}
}
