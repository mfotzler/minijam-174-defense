import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';
import { Baby } from '../entities/Baby';

export default class BabySystem implements System {
	private babiesLeft: number;
	
	private babySpawnLocations: {x: number, y: number}[] = [
		{x: 124, y: 124},
		{x: 124, y: 128},
		{x: 124, y: 132},
		{x: 124, y: 120},
		{x: 124, y: 116},
		{x: 120, y: 124},
		{x: 128, y: 124},
		{x: 120, y: 128},
		{x: 120, y: 132},
		{x: 128, y: 132},
		{x: 128, y: 128},
		{x: 132, y: 142},
	]
	
	
	constructor(private world: World) {
		this.spawnBabies();
		
		MessageBus.subscribe(EventType.BABY_COLLISION, this.onBabyCollision.bind(this));
		MessageBus.subscribe(EventType.BABY_DEATH, this.onBabyDeath.bind(this));
		MessageBus.subscribe(EventType.LAST_BABY_DEATH, this.onLastBabyDeath.bind(this));
	}
	
	step() {}
	
	private spawnBabies() {
		this.babiesLeft = this.babySpawnLocations.length;
		
		for(let i = 0; i < this.babiesLeft; i++) {
			 this.world.createEntity(Baby, this.babySpawnLocations[i]);
		}
	}
	
	private onBabyCollision({id, damage}: {id: string, damage: number}) {
		let entity = this.world.entityProvider.getEntity(id);
		
		if(entity == null)
			return;
		
		MessageBus.sendMessage(EventType.BABY_DEATH, {entityId: id});
		
	}
	
	private onBabyDeath({ entityId }: { entityId: string }) {
		let entity = this.world.entityProvider.getEntity(entityId);
		
		if(entity == null)
			return;
		
		MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId });
		MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, {key: "loss_4"})
		
		
		this.babiesLeft--;
		
		if(this.babiesLeft <= 0)
			MessageBus.sendMessage(EventType.LAST_BABY_DEATH, {});
	}
	
	private onLastBabyDeath() {
		MessageBus.sendMessage(EventType.GAME_OVER, true);	
	}
}