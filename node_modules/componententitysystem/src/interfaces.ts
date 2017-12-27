import { IComponent, IComponentFactory, IEntityFactory, IPool } from "../src/ComponentFactory";
import { IFrameEvent } from "../src/GameLoop";
import { ISystem } from "../src/System";
import { ISystemWithStates } from "../src/SystemManager";

export { IComponent, IComponentFactory, IEntityFactory, IPool, IFrameEvent, ISystem, ISystemWithStates };

// interface IFrameEvent {
//     /* The number of times the frame event was fired */
//     count: number;
//     /* The time passed in seconds since the last frame event */
//     delta: number;
//     loopCount: number;
//     reverse: boolean;
//     /* The total amount of time passed since the first frame event in seconds */
//     time: number;
// }
