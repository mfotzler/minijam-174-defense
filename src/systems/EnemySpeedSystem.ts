import { EventType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';

export default class EnemySpeedSystem implements System {
	private static readonly MAX_SPEED_MULTIPLIER = 3;
	private static readonly SPEED_MULTIPLIER_STEP = 0.2;
	private static readonly SPEED_MULTIPLIER_STEP_INTERVAL = 10000;
	private static readonly INITIAL_SPEED_MULTIPLIER = 0.5;

	private currentSpeedMultiplier = EnemySpeedSystem.INITIAL_SPEED_MULTIPLIER;
	private currentIntervalTime = 0;

	step(data: StepData) {
		this.currentIntervalTime += data.delta;

		if (this.currentIntervalTime > EnemySpeedSystem.SPEED_MULTIPLIER_STEP_INTERVAL) {
			this.currentIntervalTime = 0;
			this.currentSpeedMultiplier += EnemySpeedSystem.SPEED_MULTIPLIER_STEP;

			if (this.currentSpeedMultiplier > EnemySpeedSystem.MAX_SPEED_MULTIPLIER) {
				this.currentSpeedMultiplier = EnemySpeedSystem.MAX_SPEED_MULTIPLIER;
			}

			MessageBus.sendMessage(EventType.ENEMY_SPEED_CHANGED, this.currentSpeedMultiplier);
		}
	}

	static getCurrentSpeedMultiplier() {
		let message = MessageBus.getLastMessage<number>(EventType.ENEMY_SPEED_CHANGED);

		if (message) {
			return message;
		} else {
			return EnemySpeedSystem.INITIAL_SPEED_MULTIPLIER;
		}
	}
}
