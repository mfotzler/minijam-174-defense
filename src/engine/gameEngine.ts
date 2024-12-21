import { EventEmitter } from "events";
import { EventType, System } from "./types";

export class GameEngine {
  public systems: { system: System; runWhenPaused: boolean }[] = [];
  public events: EventEmitter;
  public isPaused: boolean = false;

  constructor() {
    this.events = new EventEmitter();
  }

  addSystem(system: System, runWhenPaused: boolean = false): void {
    this.systems.push({ system, runWhenPaused });
  }
  
  addUseCase(useCase: any) {
    //pretend something happens here.  This probably isn't needed but calling this method should hint to the developer that something is happening. 
  }

  getSystem<T extends System>(name: string): T | undefined {
    return this.systems.find(({ system }) => system.constructor.name === name)?.system as T | undefined;
  }

  step(delta: number): void {
    this.systems.forEach(async ({ system, runWhenPaused }) => {
      if (this.isPaused && !runWhenPaused) return;
      await system.step({ delta });
    });
  }
}
