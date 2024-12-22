import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import TutorialScene from './TutorialScene';
import { GameStateSystem } from '../systems/GameStateSystem';
import BugScene, { BugSceneMode } from './BugScene';

export default class MainMenu extends BaseScene {
	static readonly key = 'MainMenu';
	private renderWidth;
	private renderHeight;

	constructor() {
		super({ key: MainMenu.key });
	}

	create(): void {
		this.renderWidth = this.game.renderer.width;
		this.renderHeight = this.game.renderer.height;

		this.addTitle();
		this.addMenuButtons();

		const gamepad = window['gamepad'];
		const text = this.add.bitmapText(10, 10, 'main-font', '', 10).setDropShadow(1, 1, 0x000000, 1);
		if (gamepad) {
			text.setText(`Playing with ${gamepad.id}`);
		} else {
			text.setText('Press a button on the Gamepad to use');
		}

		this.input.gamepad.once(
			'down',
			function (pad, button, index) {
				text.setText(`Playing with ${pad.id}`);

				window['gamepad'] = pad;
			},
			this
		);
	}

	override preload() {
		super.preload();
	}

	update(time: number, delta: number): void {}

	private addTitle() {
		this.add.image(this.renderWidth / 2, this.renderHeight / 2, 'title-screen');
		this.add.image(this.renderWidth / 2 - 12, 76, 'textures', 'title');
		this.add
			.bitmapText(
				this.renderWidth / 2 + 40,
				138,
				'main-font',
				'a game by tesserex, slowback1,\n bugvevo, and mafcho',
				10,
				2
			)
			.setOrigin(0.5, 0.5)
			.setDropShadow(1, 1, 0x000000, 1);
	}

	private addMenuButtons() {
		const yPosition = 230;

		this.addIntroButton(yPosition);
		this.addPlayButtons(yPosition);
	}

	private addIntroButton(yPosition) {
		UIHelpers.addButton(this, 45, yPosition, 'Tutorial', () => {
			this.scene.start(TutorialScene.key);
		});
	}

	private addPlayButtons(yPosition) {
		UIHelpers.addCenteredButton(this, yPosition, 'Classic', () => {
			GameStateSystem.clearState();
			this.fadeToScene(BugScene.key, { fadeInDuration: 300, mode: BugSceneMode.CLASSIC });
		});

		UIHelpers.addButton(this, this.renderWidth - 45, yPosition, 'Arcade', () => {
			GameStateSystem.clearState();
			this.fadeToScene(BugScene.key, { fadeInDuration: 300, mode: BugSceneMode.ARCADE });
		});
	}
}
