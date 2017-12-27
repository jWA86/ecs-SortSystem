import { IComponent, IComponentFactory } from "./interfaces";
export { System, ISystem };
interface ISystem {
    setFactories(...args: Array<IComponentFactory<IComponent>>): any;
    process(args?: any[]): any;
    execute(...args: any[]): any;
}
declare abstract class System implements ISystem {
    factories: Array<IComponentFactory<IComponent>>;
    constructor();
    /**  Set the source of the components that will be processed.
     * One factory per component parameters in the order requested by the executed method.
     * i.e :setFactories(movingFactory, movingFactory, iaFactory);
     */
    setFactories(...args: Array<IComponentFactory<IComponent>>): void;
    process(args?: any[]): void;
    abstract execute(...args: any[]): any;
}
