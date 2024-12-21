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
import SpawnListeningSystem from '../systems/SpawnListeningSystem';
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

export default class BugScene extends BaseScene {
	static readonly key = 'BugScene';
	debugGraphics: Phaser.GameObjects.Graphics;
	private world: World;

	constructor() {
		super({ key: BugScene.key });
	}

	init() {
		super.init();

		this.engine = new GameEngine();
		this.world = new World(this);

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
		this.engine.addSystem(new SpawnListeningSystem());
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
		this.engine.addUseCase(new PlayerHealthUseCase(this.world));
	}

	preload() {
		super.preload();
		this.debugGraphics = this.add.graphics();
	}

	create(): void {
		super.create();

		this.world.addPlayer();

		for (let i = 0; i < 10; i++) {
			const x = Phaser.Math.Between(0, 256);
			const y = Phaser.Math.Between(0, 256);

			const corpse = Math.random() > 0.5 ? AntCorpse : BeetleCorpse;

			this.world.createEntity(corpse, { x, y });
		}

		this.initializeAnimations();
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
			key: 'larvae-wiggle',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'larvae',
				frames: [0, 1]
			}),
			frameRate: 4,
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
			key: 'baby-eater-walk-square',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'babyEaterSquare',
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
	}
}
