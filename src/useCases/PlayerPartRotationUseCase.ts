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
			partEntity.render.sprite.transform.angle += angle;

			const currentOffset = part.positionOffset;
			const rads = angle * (Math.PI / 180);
			// rotate the offset vector
			const x = currentOffset.x * Math.cos(rads) - currentOffset.y * Math.sin(rads);
			const y = currentOffset.x * Math.sin(rads) + currentOffset.y * Math.cos(rads);
			part.positionOffset = { x, y };
		});
	}	
}