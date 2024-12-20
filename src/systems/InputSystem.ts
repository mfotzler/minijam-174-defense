import * as Phaser from 'phaser';
import { EventType, StepData, System } from '../engine/types';
import { EntityProvider } from '../engine/world/types';
import { BugComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import PHYSICS_CONSTANTS from '../utils/physicsConstants';

export default class InputSystem implements System {
	private arrows: Phaser.Types.Input.Keyboard.CursorKeys;
	private incrementHealthKey: Phaser.Input.Keyboard.Key;
	private decrementHealthKey: Phaser.Input.Keyboard.Key;

	constructor(
		private scene: Phaser.Scene,
		private entityProvider: EntityProvider<BugComponents>
	) {
		this.arrows = scene.input.keyboard.createCursorKeys();
		this.incrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.decrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
	}

	step({}: StepData): Promise<void> | void {
		this.entityProvider.entities.forEach((entity) => {
			if (entity.render?.sprite && entity.input) {
				const body = entity.render.sprite.body;
				if (this.arrows.right.isDown) {
					body.velocity.x = PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
					//entity.render.currentAnimation = 'player-walk';
				} else if (this.arrows.left.isDown) {
					body.velocity.x = -PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
					//entity.render.currentAnimation = 'player-walk';
				} else {
					body.velocity.x = 0;
					//entity.render.currentAnimation = undefined;
				}

				if (this.arrows.up.isDown) {
					body.velocity.y = -PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
				} else if (this.arrows.down.isDown) {
					body.velocity.y = PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
				} else {
					body.velocity.y = 0;
				}

				if (Phaser.Input.Keyboard.JustDown(this.incrementHealthKey))
					MessageBus.sendMessage(EventType.PLAYER_HEAL, { heal: 1 });
				if (Phaser.Input.Keyboard.JustDown(this.decrementHealthKey))
					MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: 1 });

				if (this.scene.input.mousePointer.primaryDown) {
					MessageBus.sendMessage(EventType.PLAYER_SHOOT, {
						mousePos: this.scene.input.mousePointer.positionToCamera(this.scene.cameras.main)
					});
				}
			}
		});
	}
}
