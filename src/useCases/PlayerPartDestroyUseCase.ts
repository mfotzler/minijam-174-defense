import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { World } from '../world';

export default class PlayerPartDestroyUseCase {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_PART_DESTROY, this.onPlayerPartDestroy.bind(this));
	}
	
	private onPlayerPartDestroy({ partId }: { partId: string }) {
		const player = this.world.entityProvider.getEntity(this.world.playerId);
		if (!player?.player) return;

		player.player.parts = player.player.parts.filter((part) => part.entityId !== partId);
		MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: partId });
	}	
}