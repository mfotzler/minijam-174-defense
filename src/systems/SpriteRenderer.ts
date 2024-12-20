import { EntityDefinition } from '../engine/entities/types';
import { BugComponents, Direction, RenderComponent } from '../entities/types';
import BaseScene from '../scenes/BaseScene';

export type Renderable = {
	body: Phaser.Physics.Arcade.Body;
	transform: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.Origin;
};

export interface Renderer {
	create(entity: EntityDefinition<BugComponents>): Renderable;
	update(entity: EntityDefinition<BugComponents>): void;
	destroy(entityId: string, renderable: Renderable): void;
}

export class SpriteRenderer implements Renderer {
	private sprites: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};

	constructor(private scene: BaseScene) {}

	public create({ id, render }): Renderable {
		const sprite = this.scene.physics.add
			.sprite(0, 0, render.spriteSheet ?? 'textures', render.spriteKey)
			.setScale(render.scale ?? 1);

		this.sprites[id] = sprite;

		return {
			body: sprite.body,
			transform: sprite
		};
	}

	public update(entity: EntityDefinition<BugComponents>): void {
		const { render, facing } = entity;

		if (render.currentAnimation) {
			this.sprites[entity.id].anims.play(render.currentAnimation, true);
		} else {
			this.sprites[entity.id].anims.stop();
		}

		if (facing) {
			this.sprites[entity.id].setFlipX(facing.direction === Direction.LEFT);
		}
	}

	public destroy(entityId: string, renderable: Renderable): void {
		this.sprites[entityId].destroy();
	}
}
