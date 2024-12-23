import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import TutorialScene from './TutorialScene';
import { GameStateSystem } from '../systems/GameStateSystem';
import BugScene, { BugSceneMode } from './BugScene';
import ScoreTrackingUseCase from '../useCases/ScoreTrackingUseCase';

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

		this.anims.create({
			key: 'title-jaws',
			frames: this.anims.generateFrameNames('title-jaws', {
				frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'title-flash',
			frames: this.anims.generateFrameNumbers('title-flash', {
				frames: [
					13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
					13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
					13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0,
					1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
				]
			}),
			frameRate: 32,
			repeat: -1
		});

		this.addTitle();
		this.addMenuButtons();
	}

	override preload() {
		super.preload();
	}

	update(time: number, delta: number): void {
		if (this.input.gamepad.getPad(0)?.buttons[0].pressed) this.startArcadeMode();
		if (this.input.gamepad.getPad(0)?.buttons[3].pressed) this.startTutorial();
	}

	private addTitle() {
		this.add.image(this.renderWidth / 2, this.renderHeight / 2, 'title-screen');
		this.add.sprite(82, 190, 'title-jaws').play('title-jaws');
		this.add.sprite(this.renderWidth / 2 - 12, 68, 'title-flash').play('title-flash');
		this.add
			.bitmapText(
				this.renderWidth / 2 + 40,
				134,
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
		this.addPlayButton(yPosition);
	}

	private addIntroButton(yPosition) {
		UIHelpers.addButton(this, 65, yPosition, 'Tutorial (Y)', () => {
			this.startTutorial();
		});
	}

	private addPlayButton(yPosition) {
		UIHelpers.addButton(this, this.renderWidth - 65, yPosition, 'Arcade (A)', () => {
			this.startArcadeMode();
		});
	}

	private startTutorial() {
		this.scene.start(TutorialScene.key);
	}

	private startArcadeMode() {
		GameStateSystem.clearState();
		ScoreTrackingUseCase.reset();
		this.fadeToScene(BugScene.key, { fadeInDuration: 300, mode: BugSceneMode.ARCADE });
	}
}
