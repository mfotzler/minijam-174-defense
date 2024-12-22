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
		const playerRotationAngle = MessageBus.getLastMessage(EventType.PLAYER_ROTATION_ANGLE)?.angle;

		const offsetX =
			corpseEntity?.render?.sprite?.transform.x - playerEntity?.render?.sprite?.transform.x;
		const offsetY =
			corpseEntity?.render?.sprite?.transform.y - playerEntity?.render?.sprite?.transform.y;

		if(playerRotationAngle == null) {
			playerEntity.player.parts.push({
				entityId: id,
				positionOffset: { x: offsetX, y: offsetY }
			});
		}
		else {
			const angle = -1 * playerRotationAngle * (Math.PI / 180);
			const currentOffsetAngle = Math.atan2(offsetY, offsetX) * (180 / Math.PI);
			const currentOffsetMagnitude = Math.sqrt(offsetX ** 2 + offsetY ** 2);
			const rads = (angle) * (Math.PI / 180);
			// rotate the offset vector
			const x = offsetX * Math.cos(rads) - offsetY * Math.sin(rads);
			const y = offsetX * Math.sin(rads) + offsetY * Math.cos(rads);


			console.table(
				[
					{
						"OffsetX": offsetX,
						"OffsetY": offsetY,
						"PlayerRotationAngle": playerRotationAngle,
						"CurrentOffsetAngle": currentOffsetAngle,
						"CurrentOffsetMagnitude": currentOffsetMagnitude,
						"Rads": rads,
						"X": x,
						"Y": y
					}
				]
			);


			playerEntity.player.parts.push({
				entityId: id,
				positionOffset: { x, y }
			});
		}
		corpseEntity.corpse.isPickedUp = true;
		corpseEntity.corpse.currentHealth = corpseEntity.corpse.maxHealth;
	}
}
