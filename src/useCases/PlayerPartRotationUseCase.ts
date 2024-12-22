import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { BugComponents } from '../entities/types';
import { EntityDefinition } from '../engine/entities/types';

export default class PlayerPartRotationUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_ROTATE, this.onPlayerRotate.bind(this));
	}
	private onPlayerRotate({
		rotationMode,
		clockwise,
		stickHorizontal,
		stickVertical
	}: {
		rotationMode: 'relative' | 'absolute';
		clockwise?: boolean;
		stickHorizontal?: number;
		stickVertical?: number;
	}) {
		const player = this.world.entityProvider.getEntity(this.world.playerId);
		if (!player?.player) return;
		if(rotationMode == 'relative')
			this.rotate45Degrees(player, clockwise);
		if(rotationMode == 'absolute')
			this.rotateAbsoluteAngle(player, stickHorizontal, stickVertical);
	}

	private rotate45Degrees(player: EntityDefinition<BugComponents>, clockwise: boolean) {
		player.player.parts.forEach((part) => {
			const partEntity = this.world.entityProvider.getEntity(part.entityId);
			if (!partEntity?.render?.sprite) return;

			let angle = clockwise ? 45 : -45;
			partEntity.render.sprite.transform.angle += angle;

			const currentOffset = part.positionOffset;
			const rads = angle * (Math.PI / 180);
			// rotate the offset vector
			const x = currentOffset.x * Math.cos(rads) - currentOffset.y * Math.sin(rads);
			const y = currentOffset.x * Math.sin(rads) + currentOffset.y * Math.cos(rads);
			part.positionOffset = { x, y };
		});
	}

	private getStickAngle(stickHorizontal: number, stickVertical: number) {
		return Math.atan2(stickVertical, stickHorizontal) * (180 / Math.PI);
	}

	private rotateAbsoluteAngle(player: BugComponents & { id: string }, stickHorizontal: number, stickVertical: number) {
		player.player.parts.forEach((part) => {
			const partEntity = this.world.entityProvider.getEntity(part.entityId);
			if (!partEntity?.render?.sprite) return;

			const oldAngle = partEntity.render.sprite.transform.angle;

			const angle = this.getStickAngle(stickHorizontal, stickVertical);
			partEntity.render.sprite.transform.angle = angle;

			const currentOffset = part.positionOffset;
			const currentOffsetAngle = Math.atan2(currentOffset.y, currentOffset.x) * (180 / Math.PI);
			const currentOffsetMagnitude = Math.sqrt(currentOffset.x ** 2 + currentOffset.y ** 2);
			const rads = (currentOffsetAngle - (oldAngle - angle)) * (Math.PI / 180);
			// rotate the offset vector
			const x = currentOffsetMagnitude * Math.cos(rads);
			const y = currentOffsetMagnitude * Math.sin(rads);
			part.positionOffset = { x, y };
		});
	}
}