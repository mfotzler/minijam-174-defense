import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class GameHUD {
	private scoreText: Phaser.GameObjects.BitmapText;
	private babiesLeftText: Phaser.GameObjects.BitmapText;
	private waveText: Phaser.GameObjects.BitmapText;
	private timeToNextWaveText: Phaser.GameObjects.BitmapText;
	constructor(private scene: Scene) {
		this.create();

		MessageBus.subscribe(EventType.SCORE_UPDATED, this.onScoreChange.bind(this));
		MessageBus.subscribe(EventType.BABIES_LEFT, this.onBabiesLeftChange.bind(this));
		MessageBus.subscribe(EventType.NEW_WAVE, this.onWaveChange.bind(this));
		MessageBus.subscribe(EventType.WAVE_COUNTDOWN, this.onTimeToNextWaveChange.bind(this));
	}

	create() {
		const font = { font: '10px Courier' };

		this.scoreText = this.scene.add
			.bitmapText(2, 2, 'main-font', 'Corpses Made: 0', 10)
			.setDropShadow(1, 1, 0x000000, 1);
		this.babiesLeftText = this.scene.add
			.bitmapText(2, 15, 'main-font', 'Babies Left: 12', 10)
			.setDropShadow(1, 1, 0x000000, 1);
		this.waveText = this.scene.add
			.bitmapText(this.scene.renderer.width - 2, 2, 'main-font', 'Wave: 1', 10)
			.setOrigin(1, 0)
			.setDropShadow(1, 1, 0x000000, 1);
		this.timeToNextWaveText = this.scene.add
			.bitmapText(this.scene.renderer.width - 2, 15, 'main-font', 'Time to Next Wave: 0', 10)
			.setOrigin(1, 0)
			.setDropShadow(1, 1, 0x000000, 1);
	}

	onScoreChange(score: number) {
		this.scoreText.setText(`Corpses Made: ${score}`);
	}

	onBabiesLeftChange(babiesLeft: number) {
		this.babiesLeftText.setText(`Babies Left: ${babiesLeft}`);
	}

	onWaveChange(wave: number) {
		this.waveText.setText(`Wave: ${wave}`);
	}

	onTimeToNextWaveChange(time: number) {
		this.timeToNextWaveText.setText(`Time to Next Wave: ${time}`);
	}
}
