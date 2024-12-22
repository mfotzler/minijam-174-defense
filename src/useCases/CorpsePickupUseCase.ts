import { EventType } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
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

		const { transform } = corpseEntity.render.sprite;

		const suckFactor = 0.5;

		const offsetX = (transform.x - playerEntity?.render?.sprite?.transform.x) * suckFactor;
		const offsetY = (transform.y - playerEntity?.render?.sprite?.transform.y) * suckFactor;

		playerEntity.player.parts.push({
			entityId: id,
			positionOffset: { x: offsetX, y: offsetY }
		});
		corpseEntity.corpse.isPickedUp = true;
		corpseEntity.corpse.currentHealth = corpseEntity.corpse.maxHealth;

		// duplicated in PlayerPartRotationUseCase but I don't care now
		const offsetAngle = Math.atan2(offsetY, offsetX);
		const roundedAngle = Math.round(offsetAngle / (Math.PI / 4)) * (Math.PI / 4);
		if (Math.abs((roundedAngle + 0.01) % (Math.PI / 2)) > 0.02) {
			(transform as Phaser.GameObjects.Sprite).setFrame?.(corpseEntity.render.angledSpriteKey);
			transform.setRotation(roundedAngle - Math.PI / 4);
		} else {
			(transform as Phaser.GameObjects.Sprite).setFrame?.(corpseEntity.render.spriteKey);
			transform.setRotation(roundedAngle - Math.PI / 2);
		}
	}
}
