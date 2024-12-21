import { System, EventType } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';

export class CorpsePickupUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			this.checkIfShouldPickup(id);
		});

		MessageBus.subscribe(EventType.PLAYER_PART_COLLISION, ({ entityId }) => {
			this.checkIfShouldPickup(entityId);
		});
	}

	private checkIfShouldPickup(id: string) {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		const corpseEntity = this.world.entityProvider.getEntity(id);
		if (!playerEntity?.player || !corpseEntity?.corpse || corpseEntity.corpse.isPickedUp) return;

		const offsetX =
			corpseEntity?.render?.sprite?.transform.x - playerEntity?.render?.sprite?.transform.x;
		const offsetY =
			corpseEntity?.render?.sprite?.transform.y - playerEntity?.render?.sprite?.transform.y;

		playerEntity.player.parts.push({
			entityId: id,
			positionOffset: { x: offsetX, y: offsetY }
		});
		corpseEntity.corpse.isPickedUp = true;
	}
}
