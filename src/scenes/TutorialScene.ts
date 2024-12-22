import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MainMenu from './MainMenu';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { GameEngine } from '../engine/gameEngine';
import { MusicSystem } from '../systems/MusicSystem';
import { musicTracks } from '../utils/soundTracks';
import BugScene from './BugScene';

export default class TutorialScene extends BaseScene {
	static readonly key = 'Tutorial';
	private background: Phaser.GameObjects.Image;
	constructor() {
		super({ key: TutorialScene.key });
	}

	init(data?: unknown) {
		this.engine = new GameEngine();

		this.engine.addSystem(new MusicSystem(this));
	}

	override create(): void {
		this.addTutorialText();
		this.addBackButton();

		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		if (this.input.gamepad.getPad(0)?.buttons[0].pressed)
			this.fadeToScene(MainMenu.key, { fadeInDuration: 300 });
	}

	private addTutorialText() {
		const renderWidth = this.game.renderer.width;
		const renderHeight = this.game.renderer.height;

		this.add.nineslice(
			renderWidth / 2,
			renderHeight / 2 + 6,
			'textures',
			'menu-button2',
			renderWidth - 20,
			renderHeight - 28,
			16,
			16,
			16,
			16
		);

		UIHelpers.addCenteredText(this, 52, 'SAVE THE BABIES!');
		UIHelpers.addCenteredText(this, 66, 'When the babies are dead...');
		UIHelpers.addCenteredText(this, 78, 'YOU LOSE!').setDropShadow(1, 1, 0xff0000);

		UIHelpers.addCenteredText(this, 100, 'CONTROLS').setDropShadow(1, 1, 0x4cb05e);
		UIHelpers.addInfoSquare(this, 72, 132, 'KEYBOARD\nArrow keys move\nA/D keys rotate', 110, 54);
		UIHelpers.addInfoSquare(
			this,
			renderWidth - 72,
			132,
			'GAMEPAD\nLeft stick move\nRight stick rotate',
			110,
			54
		);
	}

	private;

	private addGraphic() {
		this.background = this.add
			.image(this.renderer.width / 2, this.renderer.height / 2, 'tutorial-graphic')
			.setScale(0.3, 0.3);
	}

	override preload() {
		super.preload();

		this.load.image('background', 'assets/background.png');
		this.load.image('tutorial-graphic', 'assets/tutorial-infographic.png');

		for (const track of musicTracks) {
			this.load.audio(track, `assets/music/${track}.wav`);
		}
	}

	protected startMusic() {
		MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_2');
	}

	private addBackButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 18, 'Back', () => {
			this.fadeToScene(MainMenu.key, { fadeInDuration: 300 });
		});
	}
}
