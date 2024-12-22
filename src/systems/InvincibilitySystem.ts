import { EventType, StepData, System } from '../engine/types';
import { World } from '../world';
import { EntityDefinition } from '../engine/entities/types';
import { BugComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';

export default class InvincibilitySystem implements System {
	constructor(
		private world: World,
		private scene: BaseScene
	) {
		MessageBus.subscribe(EventType.ENTITY_MAKE_INVINCIBLE, this.onMakeInvincible.bind(this));
	}

	static isInvincible(entity: EntityDefinition<BugComponents>) {
		return entity.invincibility?.currentDuration > 0;
	}

	static canBeMadeInvincible(entity: EntityDefinition<BugComponents>) {
		return !this.isInvincible(entity) && !!entity.invincibility?.maxDuration;
	}

	private onMakeInvincible(entity: EntityDefinition<BugComponents>) {
		entity.invincibility.currentDuration = entity.invincibility?.maxDuration ?? 250;
		this.flash(entity);
	}

	private flash(entity: EntityDefinition<BugComponents>) {
		this.setScale(entity, 0.6);

		//this should be an even number, so that the last scale is 1
		const steps = 6;
		let stepDuration = entity.invincibility.maxDuration / steps;

		for (let i = 1; i <= steps; i++) {
			this.scene.time.delayedCall(i * stepDuration, () => {
				if (i % 2 === 0) {
					this.setScale(entity, 1);
				} else {
					this.setScale(entity, 0.6);
				}
			});
		}
	}

	private setScale(entity: EntityDefinition<BugComponents>, color: number) {
		entity.render.sprite.transform.setScale(color, color);
	}

	step(data: StepData) {
		const currentlyInvincible = this.world.entityProvider.entities.filter(
			InvincibilitySystem.isInvincible
		);

		for (const entity of currentlyInvincible) {
			entity.invincibility.currentDuration -= data.delta;
			if (entity.invincibility.currentDuration <= 0) {
				entity.invincibility.currentDuration = 0;
			}
		}
	}
}
