import { IComponent, IComponentFactory } from "./interfaces";

export { System, ISystem };

interface ISystem {
    // active: boolean;
    setFactories(... args: Array<IComponentFactory<IComponent>>);
    process(args?: any[]);
    execute(... args: any[]);
}

// A factory for each parameters of the exectute function
abstract class System implements ISystem {
    public factories: Array<IComponentFactory<IComponent>>;
    // public active: boolean = true;
    constructor() { }
    /**  Set the source of the components that will be processed.
     * One factory per component parameters in the order requested by the executed method.
     * i.e :setFactories(movingFactory, movingFactory, iaFactory);
     */
    public setFactories(...args: Array<IComponentFactory<IComponent>>) {
        this.factories = args;
    }
    // Query the components and execute active ones
    public process(args?: any[]) {
        const flist = this.factories;
        const l = flist[0].iterationLength;
        const f = flist[0].values;
        for (let i = 0; i < l; ++i) {
            // get the component from the first factory that serve as a reference
            // if it is active query the other components
            const refComponent = f[i];
            if (refComponent.active) {
                // Array that hold component that will be used by the execute function
                const arr: IComponent[] = [];
                arr.push(refComponent);
                let isFound = true;
                // Iterate others factories to query rest of the components
                for (let j = 1; j < flist.length; ++j) {
                    // If the factory is the same as the factory that serve as a reference
                    // we push the same component to the args array,
                    // otherwise we query the component though get(entityId)
                    if (flist[j] === flist[0]) {
                        arr.push(refComponent);
                    } else {
                        const c = flist[j].get(refComponent.entityId);
                        if (!c) { isFound = false; break; }
                        arr.push(c);
                    }
                }
                if (isFound) {
                    // add eventual parameters passed to the process function at the end of the execute parameters list
                    if (args) {
                        const al = args.length;
                        for (let a = 0; a < al; ++a) {
                            arr.push(args[a]);
                        }
                    }
                    this.execute.apply(null, arr);
                }
            }
        }
    }
    public abstract execute(...args: any[]);
}
