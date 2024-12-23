import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';

import MainMenu from './MainMenu';
import ScoreTrackingUseCase from '../useCases/ScoreTrackingUseCase';

export default class GameOver extends BaseScene {
	static readonly key = 'GameOver';
	constructor() {
		super({ key: GameOver.key });
	}

	create(): void {
		this.add.image(this.renderer.width / 2, this.renderer.height / 2, 'generic-background');
		this.playSound();

		let score = this.getScore();
		this.addLoseScreenBackground();
		this.addLoseScreenText(score);
		this.addPlayButton();
	}

	update(time: number, delta: number): void {
		// this is a hack to stop it from going immediately into a new game as soon as the menu loads because there isn't a justDown equivalent for gamePad
		if (this.input.gamepad.getPad(0)?.buttons[0].pressed) {
			this.time.delayedCall(300, () => {
				this.startScene();
			});
		}
	}

	override preload() {
		super.preload();

		this.load.audio('game_over', 'assets/game_over.mp3');
	}

	private getScore() {
		return ScoreTrackingUseCase.currentScore;
	}

	private playSound() {
		let music = this.sound.add('game_over');

		music.play();
	}

	private addLoseScreenBackground() {
		const renderWidth = this.game.renderer.width;
		const renderHeight = this.game.renderer.height;

		this.add.nineslice(
			renderWidth / 2,
			renderHeight / 2,
			'textures',
			'menu-button2',
			renderWidth - 16,
			renderHeight - 16,
			16,
			16,
			16,
			16
		);
	}

	private addLoseScreenText(score: number) {
		UIHelpers.addCenteredText(this, 28, 'Thanks for playing...').setDropShadow(1, 1, 0xff0000);
		this.add.image(this.renderer.width / 2, 86, 'textures', 'title');

		UIHelpers.addCenteredText(this, 158, 'YOU LOSE!').setDropShadow(1, 1, 0xff0000);
		UIHelpers.addCenteredText(
			this,
			196,
			`Too bad! Yo!\n ${score} kills!\nAnd picked up... ${ScoreTrackingUseCase.corpsesPickedUp} corpses!\nYour largest 'meatball' was... ${ScoreTrackingUseCase.largestMeatball}!`
		);
	}

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 238, 'Play Again', () => {
			this.startScene();
		});
	}

	private startScene() {
		this.scene.start(MainMenu.key);
	}
}
