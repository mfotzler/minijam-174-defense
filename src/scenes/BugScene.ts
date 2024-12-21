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
import { PickupSystem } from '../systems/PickupSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { MusicSystem } from '../systems/MusicSystem';
import { SoundEffectSystem } from '../systems/SoundEffectSystem';
import { DebugRenderer } from '../systems/DebugRenderer';
import { Corpse } from '../entities/Corpse';
import { PartsSystem } from '../systems/PartsSystem';
import { Ant } from '../entities/Enemies';
import SpawnListeningSystem from '../systems/SpawnListeningSystem';
import EnemySpawnSystem from '../systems/EnemySpawnSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import BabySystem from '../systems/BabySystem';
import { GameStateSystem } from '../systems/GameStateSystem';
import PlayerHealthSystem from '../systems/PlayerHealthSystem';

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
			new RenderSystem(this, this.world.entityProvider, new DebugRenderer(this))
		);
		this.engine.addSystem(new InputSystem(this, this.world.entityProvider));
		this.engine.addSystem(new PickupSystem(this, this.world));
		this.engine.addSystem(new PartsSystem(this.world));
		this.engine.addSystem(new MusicSystem(this));
		this.engine.addSystem(new SoundEffectSystem(this));
		this.engine.addSystem(new EnemySystem(this, this.world));
		this.engine.addSystem(new SpawnListeningSystem());
		this.engine.addSystem(new EnemySpawnSystem(this.world));
		this.engine.addSystem(new WeaponSystem(this.world));
		this.engine.addSystem(new BabySystem(this.world));
		this.engine.addSystem(new GameStateSystem(this));
		this.engine.addSystem(new PlayerHealthSystem(this.world));
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
			this.world.createEntity(Corpse, { x, y });
		}

		this.world.createEntity(Ant, { x: 32, y: 32 });
	}

	protected startMusic() {
		MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_2');
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}
}
