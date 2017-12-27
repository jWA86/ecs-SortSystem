import "raf";
import { IComponent, IComponentFactory, ISystem } from "../src/interfaces";
import { ISystemWithStates, SystemManager } from "./SystemManager";

export { FrameEvent, IFrameEvent, GameLoop };
/* Object that holds time data between frame update */
interface IFrameEvent {
    /* time difference since last frame */
    delta: number;
    /* time before next render frame */
    lag: number;
    /* frequency of update */
    MS_PER_UPDATE: number;
    /* time the last frame was fired */
    lastFrame: number;
    /* time passed since the start of the game loop */
    time: number;
}

class FrameEvent implements IFrameEvent {
    public delta: number;
    public lastFrame: number;
    public lag: number;
    public time: number;
    constructor(public MS_PER_UPDATE: number) {
        this.lag = 0;
        this.lastFrame = 0;
        this.time = 0;
    }
    public reset() {
        this.lag = 0;
        this.lastFrame = 0;
        this.time = 0;
    }
}

class GameLoop {
    public timestamp = this._pollyFillHighResolutionTime();
    protected _running: boolean;
    protected _systemManager: SystemManager;
    protected _fixedTSSystems: ISystemWithStates[];
    protected _nonFixedTSSystems: ISystemWithStates[];
    protected _frameId: number;
    protected _currentTimer: FrameEvent;
    constructor(systemManager: SystemManager, timer = new FrameEvent(1000 / 30)) {
        this.setSystemManager(systemManager);
        this._currentTimer = timer;
        this._running = false;
    }

    public isRunning(): boolean {
        return this._running;
    }
    public getSystemManager(): SystemManager {
        return this._systemManager;
    }
    public getCurrentTimer(): FrameEvent {
        return this._currentTimer;
    }
    public setCurretnTimer(timer: FrameEvent) {
        this._currentTimer = timer;
    }
    public setSystemManager(systems: SystemManager) {
        this._systemManager = systems;
        this._fixedTSSystems = this._systemManager.getFixedTSSystems();
        this._nonFixedTSSystems = this._systemManager.getNonFixedTSSystems();
    }
    public start(...args: any[]) {
        this._running = true;
        this._currentTimer.reset();
        this._currentTimer.lastFrame = this.timestamp.now();
        this.loop(args);
        // this.update(timer);
    }
    public stop() {
        this._running = false;
        cancelAnimationFrame(this._frameId);
    }
    public resume() {
        this._running = true;
        this._currentTimer.lastFrame = this.timestamp.now();
        this.loop();
    }
    /* Set the process frequency in mms */
    public setFrequency(frequency: number) {
        this._currentTimer.MS_PER_UPDATE = frequency;
    }
    public loop(...args: any[]) {
        const now = this.timestamp.now();
        const ellapsed = now - this._currentTimer.lastFrame;
        this._currentTimer.delta = ellapsed;
        this._currentTimer.lastFrame = now;
        this._currentTimer.lag += ellapsed;
        this._currentTimer.time += ellapsed;
        // limit delta max value when browser loose focus and resume ?
        while (this._currentTimer.lag >= this._currentTimer.MS_PER_UPDATE) {
            this.updateFixedTS(args);
            this._currentTimer.lag -= this._currentTimer.MS_PER_UPDATE;
        }

        this.updateNonFixedTS(args);

        if (this._running) {
            this._frameId = requestAnimationFrame(() => this.loop());
        } else {
            cancelAnimationFrame(this._frameId);
        }
    }
    /* Process every Fixed Systems */
    public updateFixedTS(... args: any[]) {
        const l = this._fixedTSSystems.length;
        for (let i = 0; i < l; ++i) {
            if (this._fixedTSSystems[i].active) {
                this._fixedTSSystems[i].process([this._currentTimer, args]);
            }
        }
    }

     /* Process every Non Fixed Systems */
     public updateNonFixedTS(... args: any[]) {
        const l = this._nonFixedTSSystems.length;
        for (let i = 0; i < l; ++i) {
            if (this._nonFixedTSSystems[i].active) {
                this._nonFixedTSSystems[i].process([this._currentTimer, args]);
            }
        }
    }

    protected _pollyFillHighResolutionTime() {
        return window.performance && window.performance.now ? window.performance : Date;
    }
}
