import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class ScoreTrackingUseCase {
	public static currentScore: number = 0;
	public static corpsesPickedUp: number = 0;
	public static largestMeatball: number = 0;

	constructor() {
		ScoreTrackingUseCase.currentScore = 0;

		MessageBus.subscribe(EventType.KILL_ENEMY, this.onEnemyKilled.bind(this));
		MessageBus.subscribe(EventType.PICKUP_CORPSE, this.onCorpsePickedUp.bind(this));
		MessageBus.subscribe(EventType.MEATBALL_SIZE_CHANGED, this.onCurrentMeatballSize.bind(this));
	}

	static reset() {
		ScoreTrackingUseCase.currentScore = 0;
		ScoreTrackingUseCase.corpsesPickedUp = 0;
		ScoreTrackingUseCase.largestMeatball = 0;
	}

	private onEnemyKilled() {
		ScoreTrackingUseCase.currentScore += 1;

		MessageBus.sendMessage(EventType.SCORE_UPDATED, ScoreTrackingUseCase.currentScore);
	}

	private onCorpsePickedUp() {
		ScoreTrackingUseCase.corpsesPickedUp += 1;
	}

	private onCurrentMeatballSize(size: number) {
		if (size > ScoreTrackingUseCase.largestMeatball) {
			ScoreTrackingUseCase.largestMeatball = size;
		}
	}
}
