import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;
import MainMenu from './MainMenu';
import ScoreTrackingUseCase from '../useCases/ScoreTrackingUseCase';

export default class GameOver extends BaseScene {
	static readonly key = 'GameOver';
	private dialogueBox: DialogueBox;
	constructor() {
		super({ key: GameOver.key });
	}

	create(): void {
		this.add.image(this.renderer.width / 2, this.renderer.height / 2, 'generic-background');
		this.addPlayButton();
		this.playSound();

		let score = this.getScore();

		this.addDialogueBox(score);
	}

	update(time: number, delta: number): void {
		if (this.input.gamepad.getPad(0)?.buttons[0].pressed) this.dialogueBox.advanceMessage();
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

	private addDialogueBox(score: number) {
		this.dialogueBox = new DialogueBox(
			this,
			0,
			this.renderer.height / 2 - 100,
			[
				{
					text: `Too bad! Yo! 
 ${score} kills!  And picked up...
 ${ScoreTrackingUseCase.corpsesPickedUp} corpses!  Your largest 'meatball' was...
 ${ScoreTrackingUseCase.largestMeatball}!`,
					name: 'The Flesh Shield',
					image: 'cupcake-face'
				}
			],
			this.startScene.bind(this)
		);

		this.add.existing<Container>(this.dialogueBox);
	}

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 50, 'Play Again', () => {
			this.startScene();
		});
	}

	private startScene() {
		this.scene.start(MainMenu.key);
	}
}
