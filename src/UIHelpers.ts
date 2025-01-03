import * as Phaser from 'phaser';

export default class UIHelpers {
	static addCenteredButton(
		scene: Phaser.Scene,
		y: number,
		text: string,
		onClick: () => void
	): Phaser.GameObjects.NineSlice {
		return this.addButton(scene, scene.renderer.width / 2, y, text, onClick);
	}

	static addButton(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		onClick: () => void,
		width: number = 82
	): Phaser.GameObjects.NineSlice {
		const button = scene.add.nineslice(0, 0, 'textures', 'menu-button2', width, 32, 16, 16, 16, 16);
		button.setPosition(x, y);
		button.setInteractive();
		button.on('pointerdown', onClick);
		scene.add.bitmapText(x, y, 'main-font', text, 10, 1).setOrigin(0.5, 0.5);

		return button;
	}

	static addInfoSquare(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string = '',
		width: number = 82,
		height: number = 32
	): Phaser.GameObjects.NineSlice {
		const rect = scene.add.nineslice(
			0,
			0,
			'textures',
			'info-square',
			width,
			height,
			16,
			16,
			16,
			16
		);
		rect.setPosition(x, y);
		scene.add.bitmapText(x, y, 'main-font', text, 10, 1).setOrigin(0.5, 0.5);

		return rect;
	}

	static addCenteredText(
		scene: Phaser.Scene,
		y: number,
		text: string
	): Phaser.GameObjects.BitmapText {
		const textObject = scene.add
			.bitmapText(scene.renderer.width / 2, y, 'main-font', text, 10, 1)
			.setOrigin(0.5, 0.5);

		return textObject;
	}
}
