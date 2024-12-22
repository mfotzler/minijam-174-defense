import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MainMenu from './MainMenu';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { GameEngine } from '../engine/gameEngine';
import { MusicSystem } from '../systems/MusicSystem';
import { musicTracks } from '../utils/soundTracks';

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
		this.addGraphic();
		this.addPlayButton();

		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		if (this.input.gamepad.getPad(0)?.buttons[0].pressed)
			this.fadeToScene(MainMenu.key, { fadeInDuration: 300 });
	}

	addGraphic() {
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

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 18, 'Main Menu', () => {
			this.fadeToScene(MainMenu.key, { fadeInDuration: 300 });
		});
	}
}
