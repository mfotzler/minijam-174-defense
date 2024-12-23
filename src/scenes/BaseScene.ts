import * as Phaser from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import { GameEngine } from '../engine/gameEngine';
import { musicTracks, soundEffectTracks, voiceClipTracks } from '../utils/soundTracks';
import { EventType } from '../engine/types';
import Gamepad = Phaser.Input.Gamepad.Gamepad;

interface StartCallbackConfig {
	fadeInDuration?: number;
}

export default class BaseScene extends Phaser.Scene {
	private isFading = false;
	protected engine: GameEngine;

	preload(): void {
		this.load.atlas('textures', 'assets/texture.png', 'assets/texture.json');
		this.load.spritesheet('title-flash', 'assets/title-flash.png', {
			frameWidth: 209,
			frameHeight: 104
		});
		this.load.image('title-screen', 'assets/title-screen.png');
		this.load.image('generic-background', 'assets/generic-background.png');
		this.load.spritesheet('title-jaws', 'assets/title-jaws.png', {
			frameWidth: 16,
			frameHeight: 16
		});
		this.load.bitmapFont(
			'main-font',
			'assets/fonts/minogram_6x10.png',
			'assets/fonts/minogram_6x10.xml'
		);
		this.load.bitmapFont(
			'main-font-black',
			'assets/fonts/minogram_6x10_black.png',
			'assets/fonts/minogram_6x10.xml'
		);
		this.load.bitmapFont(
			'main-font-contrast',
			'assets/fonts/minogram_6x10_contrast.png',
			'assets/fonts/minogram_6x10.xml'
		);

		for (const track of musicTracks) {
			this.load.audio(track, `assets/music/${track}.wav`);
		}

		for (const track of soundEffectTracks) {
			this.load.audio(track, `assets/sfx/${track}.wav`);
		}

		for (const track of voiceClipTracks) {
			this.load.audio(`get-${track}`, `assets/sfx/${track}.m4a`);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	init(data?: unknown) {
		MessageBus.clearAllSubscribers();

		this.events.on('create', () => this.start(this, this.scene.settings.data), this);
		this.events.on('ready', this.start, this);
		this.events.on('wake', this.start, this);
		this.events.on('resume', this.start, this);
		this.events.on('start', this.start, this);
	}

	create() {
		this.startMusic();
	}

	protected startMusic() {}

	fadeToScene(key: string, args?: Record<string, unknown>) {
		MessageBus.sendMessage(EventType.MUSIC_STOP, {});

		if (this.isFading) return;
		this.cameras.main.fadeOut(300);
		this.isFading = true;
		this.input.keyboard.enabled = false;
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
			this.scene.sleep();
			this.scene.start(key, { fadeInDuration: 300, ...args });
			this.isFading = false;
		});
	}

	start(_scene: Phaser.Scene, { fadeInDuration }: StartCallbackConfig = {}) {
		if (fadeInDuration) {
			this.cameras.main.fadeIn(fadeInDuration);
			this.isFading = true;
			this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
				this.input.keyboard.enabled = true;
				this.isFading = false;
			});
		} else {
			this.cameras.main.resetFX();
			this.input.keyboard.enabled = true;
		}
	}
}
