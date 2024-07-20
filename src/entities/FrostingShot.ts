import { DessertComponents } from "./types";

export const FrostingShot: DessertComponents = {
    movement: { killOnCollision: true, hasGravity: true },
    collision: { tiles: false },
    render: { spriteKey: 'coin' },
    projectile: { type: 'frosting', speed: 1000, cooldown: 20 }
};
