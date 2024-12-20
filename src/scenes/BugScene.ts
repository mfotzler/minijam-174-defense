import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import { GameEngine } from '../engine/gameEngine';
import RenderSystem from '../systems/RenderSystem';
import InputSystem from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { World } from '../world';
import { CollisionSystem } from '../systems/CollisionSystem';
import PlayerHealthSystem from '../systems/PlayerHealthSystem';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { WeaponSystem } from '../systems/WeaponSystem';
import HealthDisplay from '../entities/HealthDisplay';
import { Grandma, SprinkeShotPickup } from '../entities/Pickups';
import { PickupSystem } from '../systems/PickupSystem';
import { MeleeSystem } from '../systems/MeleeSystem';
import { Asparatato, Brussel, Carrot } from '../entities/Enemies';
import { EnemySystem } from '../systems/EnemySystem';
import { MusicSystem } from '../systems/MusicSystem';
import { SoundEffectSystem } from '../systems/SoundEffectSystem';
import { GrandmaSystem } from '../systems/GrandmaSystem';
import { GameStateSystem } from '../systems/GameStateSystem';
import { DebugRenderer } from '../systems/DebugRenderer';
import { Corpse } from '../entities/Corpse';
import { Player } from '../entities/Player';
import { PartsSystem } from '../systems/PartsSystem';

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
	}

	preload() {
		super.preload();
		this.debugGraphics = this.add.graphics();
	}

	create(): void {
		super.create();

		this.world.addPlayer();

		this.world.createEntity(Corpse, { x: 256, y: 256 });
	}

	protected startMusic() {
		MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_3');
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}
}
