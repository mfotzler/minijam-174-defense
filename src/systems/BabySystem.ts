import * as Phaser from 'phaser';
import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';
import { Baby } from '../entities/Baby';
import { cloneDeep } from 'lodash';

export default class BabySystem implements System {
	private babiesLeft: number;

	private babySpawnLocations: { x: number; y: number }[] = [
		{ x: 116, y: 120 },
		{ x: 124, y: 116 },
		{ x: 130, y: 120 },
		{ x: 136, y: 124 },
		{ x: 116, y: 128 },
		{ x: 124, y: 124 },
		{ x: 132, y: 128 },
		{ x: 140, y: 132 },
		{ x: 112, y: 132 },
		{ x: 120, y: 136 },
		{ x: 128, y: 136 },
		{ x: 136, y: 140 }
	];

	constructor(private world: World) {
		this.spawnBabies();

		MessageBus.subscribe(EventType.BABY_COLLISION, this.onBabyCollision.bind(this));
		MessageBus.subscribe(EventType.BABY_DEATH, this.onBabyDeath.bind(this));
		MessageBus.subscribe(EventType.LAST_BABY_DEATH, this.onLastBabyDeath.bind(this));
	}

	step() {}

	private spawnBabies() {
		this.babiesLeft = this.babySpawnLocations.length;
		MessageBus.sendMessage(EventType.BABIES_LEFT, this.babiesLeft);

		for (let i = 0; i < this.babiesLeft; i++) {
			const baby = cloneDeep(Baby);
			baby.render.tickDelay = Phaser.Math.Between(0, 5) * 100;
			this.world.createEntity(baby, this.babySpawnLocations[i]);
		}
	}

	private onBabyCollision({ id, damage }: { id: string; damage: number }) {
		let entity = this.world.entityProvider.getEntity(id);

		if (entity == null) return;

		entity.baby.health -= damage;

		if (entity.baby.health <= 0) MessageBus.sendMessage(EventType.BABY_DEATH, { entityId: id });
		else {
			MessageBus.sendMessage(EventType.ENTITY_MAKE_INVINCIBLE, entity);
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
		}
	}

	private onBabyDeath({ entityId }: { entityId: string }) {
		let entity = this.world.entityProvider.getEntity(entityId);

		if (entity == null) return;

		MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId });
		MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'loss_4' });

		this.babiesLeft--;

		const onlyOneThirdOfBabiesLeft = this.babiesLeft <= this.babySpawnLocations.length / 3;
		const isPlayingTheme1 = MessageBus.getLastMessage(EventType.MUSIC_PLAY) === 'theme_1';

		if (onlyOneThirdOfBabiesLeft && !isPlayingTheme1)
			MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_1');

		MessageBus.sendMessage(EventType.BABIES_LEFT, this.babiesLeft);

		if (this.babiesLeft <= 0) MessageBus.sendMessage(EventType.LAST_BABY_DEATH, {});
	}

	private onLastBabyDeath() {
		MessageBus.sendMessage(EventType.GAME_OVER, true);
	}
}
