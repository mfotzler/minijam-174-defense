import { System, EventType } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';

export class PickupSystem implements System {
	constructor(
		private scene: BaseScene,
		world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const corpseEntity = world.entityProvider.getEntity(id);
			if (!playerEntity?.player || !corpseEntity?.isCorpse) return;

			const offsetX =
				corpseEntity?.render?.sprite?.transform.x - playerEntity?.render?.sprite?.transform.x;
			const offsetY =
				corpseEntity?.render?.sprite?.transform.y - playerEntity?.render?.sprite?.transform.y;

			playerEntity.player.parts.push({
				entityId: id,
				positionOffset: { x: offsetX, y: offsetY }
			});
			corpseEntity.isCorpse = false;

			// MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'weapon-pickup' });

			// MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
		});
	}

	step() {}
}
