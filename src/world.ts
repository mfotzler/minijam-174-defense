import { cloneDeep } from 'lodash';
import { EventType } from './engine/types';
import { EntityCollection } from './engine/world';
import { BugComponents } from './entities/types';
import BaseScene from './scenes/BaseScene';
import { Player } from './entities/Player';
import MessageBus from './messageBus/MessageBus';

export interface Point {
	x: number;
	y: number;
}

export class World {
	entityProvider: EntityCollection<BugComponents>;
	map: Phaser.Tilemaps.Tilemap;
	wallLayer: Phaser.Tilemaps.TilemapLayer;
	playerId: string;
	gamepad: Gamepad;

	constructor(private scene: BaseScene) {
		this.entityProvider = new EntityCollection();
		this.gamepad = window['gamepad'];
	}

	initializeMap(key: string): void {
		this.map = this.scene.make.tilemap({ key });
		const tileset = this.map.addTilesetImage('background', 'tiles');
		this.wallLayer = this.map.createLayer(0, tileset, 0, 0);
	}

	addPlayer() {
		this.playerId = this.createEntity(Player, {
			x: 100,
			y: 200
		});
	}

	createEntity(base: BugComponents, { x, y }: Point): string {
		const id = this.entityProvider.createEntityId();
		MessageBus.sendMessage(EventType.ADD_ENTITY, {
			entity: {
				...cloneDeep(base),
				position: {
					...base.position,
					x,
					y
				},
				id
			}
		});
		return id;
	}
}
