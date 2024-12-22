import * as Phaser from 'phaser';
import { EventType, StepData, System } from '../engine/types';
import { EntityProvider } from '../engine/world/types';
import { BugComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import PHYSICS_CONSTANTS from '../utils/physicsConstants';
import Gamepad = Phaser.Input.Gamepad.Gamepad;

export default class InputSystem implements System {
	private autofire = true;

	private arrows: Phaser.Types.Input.Keyboard.CursorKeys;
	private clockwise: Phaser.Input.Keyboard.Key;
	private counterClockwise: Phaser.Input.Keyboard.Key;
	private incrementHealthKey: Phaser.Input.Keyboard.Key;
	private decrementHealthKey: Phaser.Input.Keyboard.Key;
	private cheatCode: Phaser.Input.Keyboard.Key;
	private shootKey: Phaser.Input.Keyboard.Key;
	private: Gamepad;

	constructor(
		private scene: Phaser.Scene,
		private entityProvider: EntityProvider<BugComponents>
	) {
		this.arrows = scene.input.keyboard.createCursorKeys();
		this.clockwise = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.counterClockwise = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

		this.incrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.decrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
		this.cheatCode = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
		this.shootKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}

	step({}: StepData): Promise<void> | void {
		this.entityProvider.entities.forEach((entity) => {
			if (entity.render?.sprite && entity.input) {
				let moveSpeed = PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
				if (entity.player?.parts?.length) {
					// slow the movespeed by half for every 10 parts
					moveSpeed = Math.max(
						PHYSICS_CONSTANTS.PLAYER_RUN_SPEED / Math.pow(2, entity.player.parts.length / 10),
						PHYSICS_CONSTANTS.PLAYER_RUN_SPEED / 16
					);
				}

				const { transform, body } = entity.render.sprite;
				this.processKeyboardInput(body, moveSpeed);
				this.processGamepadInput(body, moveSpeed);

				if (body.velocity.x !== 0 && body.velocity.y !== 0) {
					body.velocity.x *= 0.7071;
					body.velocity.y *= 0.7071;
				}
			}
		});
	}

	private processKeyboardInput(body: Phaser.Physics.Arcade.Body, moveSpeed: number) {
		if (this.arrows.right.isDown) {
			body.velocity.x = moveSpeed;
			//entity.render.currentAnimation = 'player-walk';
		} else if (this.arrows.left.isDown) {
			body.velocity.x = -moveSpeed;
			//entity.render.currentAnimation = 'player-walk';
		} else {
			body.velocity.x = 0;
			//entity.render.currentAnimation = undefined;
		}

		if (this.arrows.up.isDown) {
			body.velocity.y = -moveSpeed;
		} else if (this.arrows.down.isDown) {
			body.velocity.y = moveSpeed;
		} else {
			body.velocity.y = 0;
		}

		if (Phaser.Input.Keyboard.JustDown(this.clockwise)) {
			MessageBus.sendMessage(EventType.PLAYER_ROTATE, {
				rotationMode: 'relative',
				clockwise: true
			});
		} else if (Phaser.Input.Keyboard.JustDown(this.counterClockwise)) {
			MessageBus.sendMessage(EventType.PLAYER_ROTATE, {
				rotationMode: 'relative',
				clockwise: false
			});
		}

		if (Phaser.Input.Keyboard.JustDown(this.incrementHealthKey))
			MessageBus.sendMessage(EventType.PLAYER_HEAL, { heal: 1 });
		if (Phaser.Input.Keyboard.JustDown(this.decrementHealthKey))
			MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: 1 });

		if (Phaser.Input.Keyboard.JustDown(this.cheatCode)) {
			MessageBus.sendMessage(EventType.ENABLE_INFINITE_MODE, true);
		}

		if (this.scene.input.mousePointer.primaryDown || this.shootKey.isDown || this.autofire) {
			MessageBus.sendMessage(EventType.PLAYER_SHOOT, {
				mousePos: this.scene.input.mousePointer.positionToCamera(this.scene.cameras.main)
			});
		}
	}

	private processGamepadInput(body: Phaser.Physics.Arcade.Body, moveSpeed: number) {
		const gamepad = this.scene.input.gamepad.getPad(0);

		if (!gamepad) return;

		const axisLeftHorizontal = gamepad.axes[0].getValue();
		const axisLeftVertical = gamepad.axes[1].getValue();
		const axisRightHorizontal = gamepad.axes[2].getValue();
		const axisRightVertical = gamepad.axes[3].getValue();

		const axisMeetsThreshold = (axis: number) => Math.abs(axis) > 0.2;

		if (axisMeetsThreshold(axisLeftHorizontal)) {
			body.velocity.x = moveSpeed * axisLeftHorizontal;
		}
		if (axisMeetsThreshold(axisLeftVertical)) {
			body.velocity.y = moveSpeed * axisLeftVertical;
		}
		if (axisMeetsThreshold(axisRightHorizontal) || axisMeetsThreshold(axisRightVertical)) {
			MessageBus.sendMessage(EventType.PLAYER_ROTATE, {
				rotationMode: 'absolute',
				stickHorizontal: axisRightHorizontal,
				stickVertical: axisRightVertical
			});
			MessageBus.sendMessage(EventType.PLAYER_SHOOT, {
				mousePos: this.scene.input.mousePointer.positionToCamera(this.scene.cameras.main)
			});
		}
	}
}
