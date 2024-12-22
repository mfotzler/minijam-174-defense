import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class PlayerPartRotationUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_ROTATE, this.onPlayerRotate.bind(this));
	}
	private onPlayerRotate({ clockwise }: { clockwise: boolean }) {
		const player = this.world.entityProvider.getEntity(this.world.playerId);
		if (!player?.player) return;

		player.player.parts.forEach((part) => {
			const partEntity = this.world.entityProvider.getEntity(part.entityId);
			if (!partEntity?.render?.sprite) return;

			const angle = clockwise ? 45 : -45;
			const currentOffset = part.positionOffset;
			const rads = angle * (Math.PI / 180);
			// rotate the offset vector
			const x = currentOffset.x * Math.cos(rads) - currentOffset.y * Math.sin(rads);
			const y = currentOffset.x * Math.sin(rads) + currentOffset.y * Math.cos(rads);
			part.positionOffset = { x, y };

			const { sprite: renderable } = partEntity.render;
			const sprite = renderable.transform as Phaser.GameObjects.Sprite;
			if (!sprite.setFrame) return;

			const offsetAngle = Math.atan2(y, x);
			const roundedAngle = Math.round(offsetAngle / (Math.PI / 4)) * (Math.PI / 4);
			if (Math.abs((roundedAngle + 0.01) % (Math.PI / 2)) > 0.02) {
				sprite.setFrame(partEntity.render.angledSpriteKey);
				sprite.setRotation(roundedAngle - Math.PI / 4);
			} else {
				sprite.setFrame(partEntity.render.spriteKey);
				sprite.setRotation(roundedAngle - Math.PI / 2);
			}
		});
	}
}
