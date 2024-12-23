import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export type EntityKnockbackData = {
	knockbackerId: string;
	knockbackeeId: string;
};

export default class EntityKnockbackUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.ENTITY_KNOCKBACK, this.onKnockback.bind(this));
	}

	onKnockback(data: EntityKnockbackData) {
		let knockbacker = this.world.entityProvider.getEntity(data.knockbackerId);
		let knockbackee = this.world.entityProvider.getEntity(data.knockbackeeId);

		if (
			!knockbacker ||
			!knockbackee ||
			!knockbackee.render ||
			!knockbacker.render ||
			knockbackee.centipede
		)
			return;

		let dx = knockbackee.render.sprite.transform.x - knockbacker.render.sprite.transform.x;
		let dy = knockbackee.render.sprite.transform.y - knockbacker.render.sprite.transform.y;

		let angle = Math.atan2(dy, dx);

		knockbackee.render.sprite.body.setVelocityX(Math.cos(angle) * 100);
		knockbackee.render.sprite.body.setVelocityY(Math.sin(angle) * 100);

		if (!!knockbackee.enemy) knockbackee.enemy.movementCooldown = 500;
	}
}
