import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import { GameEngine } from '../engine/gameEngine';
import RenderSystem from '../systems/RenderSystem';
import InputSystem from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { World } from '../world';
import { CollisionSystem } from '../systems/CollisionSystem';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { CorpsePickupUseCase } from '../useCases/CorpsePickupUseCase';
import { EnemySystem } from '../systems/EnemySystem';
import { MusicSystem } from '../systems/MusicSystem';
import { SoundEffectSystem } from '../systems/SoundEffectSystem';
import { AntCorpse, BeetleCorpse } from '../entities/Corpses';
import { PartsSystem } from '../systems/PartsSystem';
import ClassicSpawnListeningSystem from '../systems/ClassicSpawnListeningSystem';
import EnemySpawnSystem from '../systems/EnemySpawnSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import BabySystem from '../systems/BabySystem';
import EntityKnockbackUseCase from '../useCases/EntityKnockbackUseCase';
import PlayerPartDestroyUseCase from '../useCases/PlayerPartDestroyUseCase';
import PlayerPartRotationUseCase from '../useCases/PlayerPartRotationUseCase';
import InvincibilitySystem from '../systems/InvincibilitySystem';
import EnemyCountUseCase from '../useCases/EnemyCountUseCase';
import WinConditionUseCase from '../useCases/WinConditionUseCase';
import GameOverUseCase from '../useCases/GameOverUseCase';
import { SpriteRenderer } from '../systems/SpriteRenderer';
import PlayerHealthUseCase from '../useCases/PlayerHealthUseCase';
import PlayerPartDamageUseCase from '../useCases/PlayerPartDamageUseCase';
import ArcadeSpawnListeningSystem from '../systems/ArcadeSpawnListeningSystem';
import ScoreTrackingUseCase from '../useCases/ScoreTrackingUseCase';

export enum BugSceneMode {
	// A mode with a finite number of enemies and a win condition
	CLASSIC = 0,
	// A mode with an infinite number of enemies and no win condition.  Keep going til you lose!
	ARCADE = 1
}

export default class BugScene extends BaseScene {
	static readonly key = 'BugScene';
	debugGraphics: Phaser.GameObjects.Graphics;
	private world: World;
	private mode: BugSceneMode;

	constructor() {
		super({ key: BugScene.key });
	}

	override start(_scene: Phaser.Scene, { fadeInDuration, mode }: any = {}) {
		super.start(_scene, { fadeInDuration });

		this.mode = mode ?? BugSceneMode.CLASSIC;

		this.initializeSpawnListeningSystem();
	}

	init() {
		super.init();

		this.engine = new GameEngine();
		this.world = new World(this);
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('bugworldbackground', 'assets/bugworldbackground.json');
		this.load.image('tiles', 'assets/background.png');

		this.debugGraphics = this.add.graphics();
	}

	create(): void {
		super.create();
		this.world.initializeMap('bugworldbackground');

		this.initializeGameMechanics();

		this.world.addPlayer();

		for (let i = 0; i < 10; i++) {
			const x = Phaser.Math.Between(0, 256);
			const y = Phaser.Math.Between(0, 256);

			const corpse = Math.random() > 0.5 ? AntCorpse : BeetleCorpse;

			this.world.createEntity(corpse, { x, y });
		}

		this.initializeAnimations();
		this.startMusic();
	}

	initializeGameMechanics() {
		this.engine.addSystem(new MovementSystem(this.world.entityProvider, this));
		this.engine.addSystem(new CollisionSystem(this, this.world));
		this.engine.addSystem(
			new RenderSystem(this, this.world.entityProvider, new SpriteRenderer(this))
		);
		this.engine.addSystem(new InputSystem(this, this.world.entityProvider));
		this.engine.addSystem(new PartsSystem(this.world));
		this.engine.addSystem(new MusicSystem(this));
		this.engine.addSystem(new SoundEffectSystem(this));
		this.engine.addSystem(new EnemySystem(this, this.world));
		this.engine.addSystem(new EnemySpawnSystem(this.world));
		this.engine.addSystem(new WeaponSystem(this.world));
		this.engine.addSystem(new BabySystem(this.world));
		this.engine.addSystem(new InvincibilitySystem(this.world, this));
		this.engine.addUseCase(new CorpsePickupUseCase(this.world));
		this.engine.addUseCase(new EntityKnockbackUseCase(this.world));
		this.engine.addUseCase(new PlayerPartDestroyUseCase(this.world));
		this.engine.addUseCase(new PlayerPartRotationUseCase(this.world));
		this.engine.addUseCase(new EnemyCountUseCase());
		this.engine.addUseCase(new WinConditionUseCase(this));
		this.engine.addUseCase(new GameOverUseCase(this));
		// this.engine.addUseCase(new PlayerHealthUseCase(this.world));
		this.engine.addUseCase(new PlayerPartDamageUseCase(this.world));
		this.engine.addUseCase(new ScoreTrackingUseCase());
	}

	private initializeSpawnListeningSystem() {
		if (this.mode === BugSceneMode.CLASSIC) {
			this.engine.addSystem(new ClassicSpawnListeningSystem());
		} else if (this.mode === BugSceneMode.ARCADE) {
			this.engine.addSystem(new ArcadeSpawnListeningSystem());
		}
	}

	protected startMusic() {
		MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_2');
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}

	private initializeAnimations() {
		this.anims.create({
			key: 'player-walk-square',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'mainCharacterSquare',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'player-walk-angle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'mainCharacterAngle',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'larvae-wiggle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'larvae',
				frames: [0, 1]
			}),
			frameRate: 2,
			repeat: -1
		});

		this.anims.create({
			key: 'ant-walk-square',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'shieldBugSquare',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'ant-walk-angle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'shieldBugAngle',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'baby-eater-walk-square',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'babyEaterSquare',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'baby-eater-walk-angle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'babyEaterAngle',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'beetle-walk-square',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'beetleSquare',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'beetle-walk-angle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'beetleAngle',
				frames: [0, 1, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});
	}
}
