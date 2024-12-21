import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import InvincibilitySystem from '../systems/InvincibilitySystem';

export default class PlayerHealthUseCase {
	private currentHealth: number;
	constructor(private world: World) {
		this.initializePlayerHealth();
		MessageBus.subscribe(EventType.PLAYER_HEALTH, this.onPlayerHealth.bind(this), {
			shouldInitializeWithLastMessage: true
		});
		MessageBus.subscribe(EventType.PLAYER_DAMAGE, this.onDamage.bind(this));
		MessageBus.subscribe(EventType.PLAYER_HEAL, this.onHeal.bind(this));
	}

	private initializePlayerHealth() {
		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: 5 });
	}

	private onPlayerHealth(data: { health: number }) {
		this.currentHealth = data.health;

		if (data.health <= 0) {
			{
				MessageBus.sendMessage(EventType.PLAYER_DEAD, { isDead: true });
			}
		}
	}

	private onDamage(data: { damage: number }) {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);

		if (InvincibilitySystem.isInvincible(playerEntity)) return;

		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: this.currentHealth - data.damage });
		MessageBus.sendMessage(EventType.ENTITY_MAKE_INVINCIBLE, playerEntity);
		MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
	}

	private onHeal(data: { heal: number }) {
		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: this.currentHealth + data.heal });
	}
}
