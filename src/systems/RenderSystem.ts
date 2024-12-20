import { EventType, StepData, System } from '../engine/types';
import { BugComponents, Direction, RenderComponent } from '../entities/types';
import { EntityCollection } from '../engine/world';
import BaseScene from '../scenes/BaseScene';
import { EntityDefinition } from '../engine/entities/types';
import MessageBus from '../messageBus/MessageBus';
import { Renderable, Renderer } from './SpriteRenderer';

export default class RenderSystem implements System {
	private sprites: { [id: string]: Renderable } = {};

	constructor(
		scene: BaseScene,
		private entityProvider: EntityCollection<BugComponents>,
		private renderer: Renderer
	) {
		MessageBus.subscribe(
			EventType.ADD_ENTITY,
			({ entity }: { entity: EntityDefinition<BugComponents> }) => {
				const { id, position, movement, render, projectile } = entity;
				if (!this.sprites[id] && render) {
					const entitySprite = this.renderer.create(entity);
					entitySprite.transform.setPosition(position?.x ?? 0, position?.y ?? 0);

					if (render.followWithCamera) scene.cameras.main.startFollow(entitySprite);

					if (movement?.initialVelocity) {
						entitySprite.body.setVelocity(movement.initialVelocity.x, movement.initialVelocity.y);
					}

					if (movement?.rotation?.startAngle) {
						entitySprite.transform.setAngle(movement.rotation.startAngle);
					}

					if (movement?.rotation?.velocity) {
						entitySprite.body.setAngularVelocity(movement.rotation.velocity);
					}

					if (movement?.rotation?.origin) {
						entitySprite.transform.setOrigin(
							movement.rotation.origin.x,
							movement.rotation.origin.y
						);
					}

					this.sprites[id] = entitySprite;

					MessageBus.sendMessage(EventType.ENTITY_ADDED, { id, entitySprite, entity });

					if (projectile?.lifetime) {
						scene.time.delayedCall(projectile.lifetime, () => {
							MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
						});
					}
				}
			}
		);

		MessageBus.subscribe(EventType.ENTITY_DELETED, ({ entityId: id }) => {
			const entitySprite = this.sprites[id];
			if (entitySprite) {
				this.renderer.destroy(id, entitySprite);
				delete this.sprites[id];
			}
		});
	}

	step({}: StepData) {
		this.entityProvider.entities.forEach((entity) => {
			const { render, position } = entity;

			if (render && position) {
				this.ensureEntityHasSprite(entity);
				this.renderer.update(entity);
			}
		});
	}

	private ensureEntityHasSprite(entity: EntityDefinition<BugComponents>) {
		if (!this.sprites[entity.id]) {
			this.sprites[entity.id] = this.renderer.create(entity);
		}
		if (!entity.render.sprite) {
			entity.render.sprite = this.sprites[entity.id];
		}
	}
}
