import { EventType, System } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import * as Phaser from 'phaser';
import { BugComponents } from '../entities/types';
import { EntityKnockbackData } from '../useCases/EntityKnockbackUseCase';
import InvincibilitySystem from './InvincibilitySystem';

export class CollisionSystem implements System {
	constructor(
		scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(
			EventType.ENTITY_ADDED,
			({ id, entitySprite }: { id: string; entitySprite: Phaser.GameObjects.Sprite }) => {
				const entity = world.entityProvider.getEntity(id);
				if (!entity.collision) return;

				if (entity.collision.tiles) {
					scene.physics.add.existing(entitySprite);
					scene.physics.add.collider(entitySprite, world.wallLayer);
				}
			}
		);
	}

	step() {
		this.world.entityProvider.entities.forEach((entity) => {
			this.checkForPlayerCollision(entity);
			this.checkForProjectileCollision(entity);
			this.checkForBabyCollision(entity);
		});
	}

	private checkForProjectileCollision(entity: BugComponents & { id: string }) {
		if (!entity?.projectile) return;
		const entitySprite = entity.render?.sprite;

		if (!entitySprite) return;

		const targets = this.world.entityProvider.entities.filter((e) =>
			e.collision?.tags?.includes('projectile')
		);

		targets.forEach((target) => {
			if (!target.render?.sprite) return;
			const targetSprite = target.render.sprite;
			const targetBox = targetSprite.transform.getBounds();
			const entityBoundingBox = entitySprite.transform.getBounds();

			const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
				targetBox,
				entityBoundingBox
			);

			if (isOverlapping) {
				MessageBus.sendMessage(EventType.PROJECTILE_COLLISION, {
					id: target.id,
					damage: entity.projectile.damage ?? 1
				});
				if (entity.collision?.killOnCollision) {
					MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: entity.id });
				}
				if (entity.projectile.knockback) {
					const knockback = entity.projectile.knockback;
					const dx = targetSprite.transform.x - entitySprite.transform.x;
					const dy = targetSprite.transform.y - entitySprite.transform.y;
					const angle = Math.atan2(dy, dx);
					targetSprite.body.setVelocity(Math.cos(angle) * knockback, Math.sin(angle) * knockback);
				}
			}
		});
	}

	private checkForPlayerCollision(entity: BugComponents & { id: string }) {
		if (entity.collision?.player && entity.render?.sprite) {
			const player = this.world.entityProvider.getEntity(this.world.playerId);
			if (!player?.render?.sprite) return;

			const playerSprite = player.render.sprite;
			const playerBoundingBox = playerSprite.transform.getBounds();
			const entitySprite = entity.render.sprite;
			const entityBoundingBox = entitySprite.transform.getBounds();

			// if the player is touching the entity, send a message
			const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
				playerBoundingBox,
				entityBoundingBox
			);
			if (isOverlapping) {
				MessageBus.sendMessage(EventType.PLAYER_COLLISION, { id: entity.id });
				if (entity.collision?.killOnCollision) {
					MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: entity.id });
				}
				return;
			}

			player.player.parts.forEach((part) => {
				const partEntity = this.world.entityProvider.getEntity(part.entityId);
				if (
					Phaser.Geom.Intersects.RectangleToRectangle(
						partEntity.render.sprite.transform.getBounds(),
						entityBoundingBox
					)
				) {
					MessageBus.sendMessage(EventType.ENTITY_KNOCKBACK, {
						knockbackerId: part.entityId,
						knockbackeeId: entity.id
					} as EntityKnockbackData);
					MessageBus.sendMessage(EventType.PLAYER_PART_COLLISION, {
						entityId: entity.id,
						partId: part.entityId
					});
					if (entity.collision?.killOnCollision) {
						MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: entity.id });
					}
				}
			});
		}
	}

	private checkForBabyCollision(maybeBaby: BugComponents & { id: string }) {
		if (!maybeBaby.baby) return;

		const baby = maybeBaby;

		const babySprite = baby.render?.sprite;

		if (!babySprite) return;

		const babyStealers = this.world.entityProvider.entities.filter((e) =>
			e.collision?.tags?.includes('baby')
		);

		babyStealers.forEach((babyStealer) => {
			if (!babyStealer.render?.sprite) return;
			const babyStealerSprite = babyStealer.render.sprite;
			const babyStealerBox = babyStealerSprite.transform.getBounds();
			const babyBoundingBox = babySprite.transform.getBounds();

			const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
				babyStealerBox,
				babyBoundingBox
			);

			const babyIsInvincible = InvincibilitySystem.isInvincible(baby);

			if (isOverlapping && !babyIsInvincible) {
				MessageBus.sendMessage(EventType.ENTITY_KNOCKBACK, {
					knockbackerId: baby.id,
					knockbackeeId: babyStealer.id
				} as EntityKnockbackData);
				MessageBus.sendMessage(EventType.BABY_COLLISION, {
					id: baby.id,
					damage: babyStealer.enemy?.damage ?? 1
				});
				if (baby.collision?.killOnCollision) {
					MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: baby.id });
				}
			}
		});
	}
}
