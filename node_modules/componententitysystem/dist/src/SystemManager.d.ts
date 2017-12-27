import { FastIterationMap } from "FastIterationMap";
import { TimeMeasure } from "../src/TimeMeasure";
import { IComponent, IComponentFactory, ISystem } from "./interfaces";
export { SystemManager, ISystemWithStates };
interface ISystemWithStates {
    id: string;
    active: boolean;
    measureTime: boolean;
    system: ISystem;
    perfMeasure: TimeMeasure;
    setFactories(...args: Array<IComponentFactory<IComponent>>): any;
    process(args?: any[]): any;
}
declare class SystemManager {
    protected fixedTimeStepSystems: FastIterationMap<string, ISystemWithStates>;
    protected nonFixedTimeStepSystems: FastIterationMap<string, ISystemWithStates>;
    constructor();
    pushSystem(system: ISystem, fixedTimeStep?: boolean): string;
    getFixedTSSystems(): ISystemWithStates[];
    getNonFixedTSSystems(): ISystemWithStates[];
    get(systemId: string): ISystemWithStates;
    protected generateId(system: ISystem): string;
    protected getListOfSystemId(className: string): string[];
    protected orderSystem(): void;
}
