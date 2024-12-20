import { EntityDefinition } from '../engine/entities/types';
import { DessertComponents, RenderComponent } from '../entities/types';
import BaseScene from '../scenes/BaseScene';
import { Renderable, Renderer } from './SpriteRenderer';

export class DebugRenderer implements Renderer {
	constructor(private scene: BaseScene) {}

	public create({ render }: EntityDefinition<DessertComponents>): Renderable {
		const rect = this.scene.add.rectangle(
			0,
			0,
			render.width ?? 32,
			render.height ?? 32,
			render.fillColor ?? 0xcc00cc
		);
		const withBody = this.scene.physics.add.existing(rect);
		return {
			body: withBody.body as Phaser.Physics.Arcade.Body,
			transform: rect,
			destroy: () => rect.destroy()
		};
	}

	public update(entity: EntityDefinition<DessertComponents>): void {
		// no-op, it's just a rectangle
	}
}
