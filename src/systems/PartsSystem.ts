import { StepData, System } from '../engine/types';
import { World } from '../world';

export class PartsSystem implements System {
	constructor(private world: World) {}

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
