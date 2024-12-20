import { EntityDefinition } from '../engine/entities/types';
import { DessertComponents, Direction, RenderComponent } from '../entities/types';
import BaseScene from '../scenes/BaseScene';

export type Renderable = {
	body: Phaser.Physics.Arcade.Body;
	transform: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.Origin;
	destroy: () => void;
};

export interface Renderer {
	create(entity: EntityDefinition<DessertComponents>): Renderable;
	update(entity: EntityDefinition<DessertComponents>): void;
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
			transform: sprite,
			destroy: () => sprite.destroy()
		};
	}

	public update(entity: EntityDefinition<DessertComponents>): void {
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
}
