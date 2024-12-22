import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { World } from '../world';
import InvincibilitySystem from '../systems/InvincibilitySystem';

export default class PlayerPartDamageUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_PART_COLLISION, this.onPartCollision.bind(this));
	}

	private onPartCollision({ entityId, partId }: { entityId: string; partId: string }) {
		const entity = this.world.entityProvider.getEntity(entityId);
		const part = this.world.entityProvider.getEntity(partId);

		if (!entity || !part || !entity.enemy || !part.corpse || InvincibilitySystem.isInvincible(part))
			return;

		part.corpse.currentHealth -= entity.enemy.damage;

		if (part.corpse.currentHealth <= 0) {
			MessageBus.sendMessage(EventType.PLAYER_PART_DESTROY, { partId: partId });
		} else {
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
			MessageBus.sendMessage(EventType.ENTITY_MAKE_INVINCIBLE, part);
		}
	}
}
