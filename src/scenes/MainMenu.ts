import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import TutorialScene from './TutorialScene';
import { GameStateSystem } from '../systems/GameStateSystem';
import BugScene, { BugSceneMode } from './BugScene';

export default class MainMenu extends BaseScene {
	static readonly key = 'MainMenu';
	constructor() {
		super({ key: MainMenu.key });
	}

	create(): void {
		this.addTitle();
		this.addIntroButton();
		this.addPlayButtons();

		const gamepad = window['gamepad'];
		const text = this.add.bitmapText(10, 10, 'main-font', '', 10);
		if (gamepad) {
			text.setText(`Playing with ${gamepad.id}`);
		} else {
			text.setText('Press a button on the Gamepad to use');
		}

		this.input.gamepad.once('down', function (pad, button, index)
		{
			text.setText(`Playing with ${pad.id}`);

			window['gamepad'] = pad;
		}, this);
	}

	override preload() {
		super.preload();
	}

	update(time: number, delta: number): void {}

	private addCoins() {
		this.anims.create({
			key: 'sprinkle-spin',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'sprinkle',
				frames: [1, 2, 3, 4]
			}),
			frameRate: 8,
			repeat: -1
		});

		let sprinkle1 = this.add.sprite(150, 90, 'textures', 'sprinkle1');
		let sprinkle2 = this.add.sprite(this.renderer.width - 150, 90, 'textures', 'sprinkle1');

		sprinkle1.scale = 4;
		sprinkle2.scale = 4;

		sprinkle1.play('sprinkle-spin');
		sprinkle2.play('sprinkle-spin');
	}

	private addTitle() {
		this.add.image(this.game.renderer.width / 2, 40, 'textures', 'title').setScale(0.8, 1);
		this.add
			.bitmapText(
				this.game.renderer.width / 2,
				100,
				'main-font',
				'a game by tesserex, slowback1,\n bugvevo, and mafcho',
				10
			)
			.setOrigin(0.5, 0.5);
	}

	private addIntroButton() {
		UIHelpers.addCenteredButton(this, 135, 'Intro', () => {
			this.scene.start(TutorialScene.key);
		});
	}

	private addPlayButtons() {
		UIHelpers.addCenteredButton(this, 175, 'Classic', () => {
			GameStateSystem.clearState();
			this.fadeToScene(BugScene.key, { fadeInDuration: 300, mode: BugSceneMode.CLASSIC });
		});

		UIHelpers.addCenteredButton(this, 215, 'Arcade', () => {
			GameStateSystem.clearState();
			this.fadeToScene(BugScene.key, { fadeInDuration: 300, mode: BugSceneMode.ARCADE });
		});
	}
}
