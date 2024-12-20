import { EventType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';

export class PartsSystem implements System {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_ROTATE, ({ clockwise }: { clockwise: boolean }) => {
			const player = this.world.entityProvider.getEntity(this.world.playerId);
			if (!player?.player) return;

			player.player.parts.forEach((part) => {
				const partEntity = this.world.entityProvider.getEntity(part.entityId);
				if (!partEntity?.render?.sprite) return;

				const angle = clockwise ? 45 : -45;
				partEntity.render.sprite.transform.angle += angle;

				const currentOffset = part.positionOffset;
				const rads = angle * (Math.PI / 180);
				// rotate the offset vector
				const x = currentOffset.x * Math.cos(rads) - currentOffset.y * Math.sin(rads);
				const y = currentOffset.x * Math.sin(rads) + currentOffset.y * Math.cos(rads);
				part.positionOffset = { x, y };
			});
		});
	}

	step(data: StepData) {
		const player = this.world.entityProvider.getEntity(this.world.playerId);

		if (player?.player && player.render?.sprite) {
			player.player.parts.forEach((part) => {
				const partEntity = this.world.entityProvider.getEntity(part.entityId);
				if (!partEntity?.render?.sprite) return;

				partEntity.render.sprite.transform.setPosition(
					player.render.sprite.transform.x + part.positionOffset.x,
					player.render.sprite.transform.y + part.positionOffset.y
				);
			});
		}
	}
}
