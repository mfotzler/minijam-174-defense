import * as Phaser from 'phaser';
import { Messages } from '../messageBus/Messages';
import MessageBus from '../messageBus/MessageBus';
import BitmapText = Phaser.GameObjects.BitmapText;
import Container = Phaser.GameObjects.Container;
import Image = Phaser.GameObjects.Image;

export interface DialogueMessage {
	text: string;
	name: string;
	image: string;
}

export default class DialogueBox extends Container {
	private text: BitmapText;
	private clickIndicator: BitmapText;
	private nameText: BitmapText;
	private image: Image;
	private currentMessageIndex = 0;

	static height: number = 200;
	private mouseClickIndicator: Phaser.GameObjects.Image;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private messages: DialogueMessage[],
		private lastMessageCallback?: () => void
	) {
		super(scene, x, y);

		const background = scene.add.nineslice(
			0,
			0,
			'textures',
			'menu-button2',
			scene.renderer.width,
			DialogueBox.height,
			16,
			16,
			16,
			16
		);
		background.setOrigin(0, 0);
		this.add(background);

		this.nameText = scene.add.bitmapText(10, 5, 'main-font', '', 10);
		this.nameText.setOrigin(0, 0);
		this.add(this.nameText);

		this.text = scene.add.bitmapText(10, 145, 'main-font', '', 10);
		this.text.setOrigin(0, 0);
		this.add(this.text);

		this.mouseClickIndicator = scene.add.image(
			scene.renderer.width - 40,
			DialogueBox.height - 40,
			'textures',
			'mouse'
		);
		this.add(this.mouseClickIndicator);

		this.clickIndicator = scene.add.bitmapText(
			background.width - 420,
			340,
			'main-font',
			'Click to Continue',
			10
		);
		this.clickIndicator.setOrigin(0, 0);
		this.add(this.clickIndicator);

		this.showMessage(messages[0]);
		// show the next message on click
		background.setInteractive();
		background.on('pointerdown', () => {
			this.advanceMessage();
		});
	}

	public advanceMessage() {
		if (this.currentMessageIndex === this.messages.length - 1) {
			MessageBus.sendMessage(Messages.DialogueComplete, {});
			this.lastMessageCallback && this.lastMessageCallback();
		}

		if (this.currentMessageIndex < this.messages.length - 1) {
			this.currentMessageIndex++;
			this.showMessage(this.messages[this.currentMessageIndex]);
		}
	}

	private showMessage(message: DialogueMessage) {
		if (this.image) {
			this.image.destroy();
		}
		this.image = this.scene.add.image(20, 20, 'textures', message.image);
		this.image.setOrigin(0, 0);
		this.add(this.image);

		this.nameText.setText(message.name);
		this.text.setText(message.text);

		this.clickIndicator.setVisible(this.shouldShowIndicator());
	}

	private shouldShowIndicator() {
		return this.currentMessageIndex < this.messages.length - 1;
	}
}
