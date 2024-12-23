import type { EventEmitter } from 'events';
import type { GameEngine } from './gameEngine';

export interface StepData {
	delta: number;
}

export interface System {
	step: (data: StepData) => Promise<void> | void;
}

export interface Engine {
	game: GameEngine;
	events: EventEmitter;
	start: () => Promise<void>;
	stop: () => Promise<void>;
}

export enum EventType {
	/**
	 * Occurs at the beginning of a step, after the step counter has incremented
	 * but before any systems have been run.
	 */
	STEP_BEGIN = 'stepBegin',
	/**
	 * Occurs at the end of a step, after all systems have been run.
	 */
	STEP_END = 'stepEnd',
	/**
	 * Requests that an entity be added to the world.
	 * Do not use this to modify the entity as it will be deep cloned first.
	 */
	ADD_ENTITY = 'addEntity',
	DELETE_ENTITY = 'deleteEntity',
	ENTITY_DELETED = 'entityDeleted',
	ENTITY_PREINIT = 'entityPreInit',
	ENTITY_ADDED = 'entityAdded',
	ENTITY_KNOCKBACK = 'entityKnockback',
	ENTITY_MAKE_INVINCIBLE = 'entityMakeInvincible',

	NEW_WAVE = 'newWave',
	WAVE_COUNTDOWN = 'waveCountdown',
	SPAWN_ENEMY = 'spawnEnemy',
	KILL_ENEMY = 'killEnemy',
	ALL_ENEMIES_SPAWNED = 'allEnemiesSpawned',
	ALL_ENEMIES_KILLED = 'allEnemiesKilled',
	ENEMY_SPEED_CHANGED = 'enemySpeedChanged',
	SPAWN_CORPSE = 'spawnCorpse',

	MUSIC_PLAY = 'musicPlay',
	MUSIC_STOP = 'musicStop',
	SOUND_EFFECT_PLAY = 'soundEffectPlay',
	PROJECTILE_COLLISION = 'projectileCollision',

	// Player events
	PLAYER_HEALTH = 'playerHealth',
	PLAYER_DEAD = 'playerDead',
	PLAYER_DAMAGE = 'playerDamage',
	PLAYER_HEAL = 'playerHeal',
	PLAYER_SHOOT = 'playerShoot',
	PLAYER_SWITCH_WEAPON = 'playerSwitchWeapon',
	PLAYER_COLLISION = 'playerCollision',
	PLAYER_PART_COLLISION = 'playerPartCollision',
	PLAYER_PART_DESTROY = 'playerPartDestroy',
	PLAYER_MELEE = 'playerMelee',
	PLAYER_ROTATE = 'playerRotate',
	PICKUP_CORPSE = 'pickupCorpse',
	MEATBALL_SIZE_CHANGED = 'meatballSizeChanged',

	BABY_COLLISION = 'babyCollision',
	BABY_DEATH = 'babyDeath',
	LAST_BABY_DEATH = 'lastBabyDeath',
	BABIES_LEFT = 'babiesLeft',

	GAME_OVER = 'gameOver',
	SCORE_UPDATED = 'scoreUpdated',

	// Game State Events
	SAVE_GRANDMA = 'saveGrandma',
	ENABLE_INFINITE_MODE = 'enableInfiniteMode'
}

export type SpawnType = 'ant' | 'beetle' | 'babyEaterAnt' | 'centipede';
export type SpawnLocation = 'north' | 'south' | 'east' | 'west';

export interface SpawnData {
	ticks: number;
	type: SpawnType;
	location: SpawnLocation;
	count?: number;
}
