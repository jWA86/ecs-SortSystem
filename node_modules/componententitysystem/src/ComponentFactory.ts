import { FastIterationMap } from "FastIterationMap";
export { ComponentFactory, EntityFactory, IComponent, IComponentFactory, IEntityFactory, IPool };

/* Components have to implement this interface in order to be processed by systems */
interface IComponent {
    entityId: number;
    active: boolean;
}

interface IPool {
    /* return the length to iterate created components and avoid iterate maximum number of zeored components
    */
    iterationLength: number;
    /* nb of created active components */
    nbActive: number;
    /* Nb actives and inactives created components */
    nbCreated: number;
    /* Nb of zeroed components ( free slot for creating components) */
    nbFreeSlot: number;
    /* Nb of created inactive components */
    nbInactive: number;
    /* Return the size of the pool */
    size: number;
    /* Create a component with the provided values*/
    create(entityId: number, active: boolean);
    /* Delete a component by its id if it's in the pool */
    delete(entityId: number): boolean;
    /* Get a component by its id */
    get(entityId: number);
    /* Does the pool contain a component with this id */
    has(entityId: number): boolean;
    /* Resize the pool, either add zeroed components or delete last components (created or zeroed indistinctly) */
    resize(size: number);
}

interface IComponentFactory<T extends IComponent> extends IPool {
    /* Return keys of all created components and their index in the values array */
    keys: Map<number, number>;
    /* Same as size */
    length: number;
    /* Hold components, use for iteration in Systems. */
    values: T[];
    /* Add components but instanciated outside the pool (should probably not be used) */
    push(key: number, value: T);
    /* Same as push */
    set(key: number, value: T);
    /* Set the ative proprety of a component */
    activate(entityId: number, value: boolean);
    /* Empty the pool from zeroed and created components */
    clear();
    swap(key1: number, key2: number);
}

interface IEntityFactory extends IPool {
    addFactory(name: string, factory: IComponentFactory<IComponent>);
    getComponent(entityId: number, factoryName: string): IComponent;
    /* get components by providing the entityId and the factory */
    getFactory(name: string): IComponentFactory<IComponent>;
}

class ComponentFactory<T extends IComponent> extends FastIterationMap<number, T> implements IComponentFactory<T> {
    protected _iterationLength: number = 0; // use by the system for iteration, avoid iterate over zeroed components
    protected _zeroedRef: T;
    protected _nbActive: number = 0;
    protected _nbInactive: number = 0;
    protected _nbCreated: number = 0;

    constructor(protected _size: number, componentType: { new(entityId: number, active: boolean, ...args: any[]): T }, ...args: any[]) {
        super();
        this._zeroedRef = new componentType(0, false, ...args);
        this._values.length = this._size;
        for (let i = 0; i < _size; ++i) {
           this.createZeroedComponentAt(i);
        }
    }

    public activate(entityId: number, value: boolean) {
        const c = this.get(entityId);
        if (c.active !== value) {
            c.active = value;
            if (value) {
                this._nbActive += 1;
                this._nbInactive -= 1;
            } else {
                this._nbActive -= 1;
                this._nbInactive += 1;
            }
        }
    }
/* Set the active proprety of all component in the pool */
    public activateAll(value: boolean) {
        for (let i = 0; i < this.size; ++i) {
            this._values[i].active = value;
        }
        if (value) {
            this._nbActive = this._nbCreated;
            this._nbInactive = 0;
        } else {
            this._nbActive = 0;
            this._nbInactive = this._nbCreated;
        }
    }

    public clear(): void {
        super.clear();
        this._nbActive = 0;
        this._nbInactive = 0;
        this._nbCreated = 0;
        this._iterationLength = 0;
    }

    public create( entityId: number, active: boolean, ...args: any[]): T {
        let index: number;
        let toReplaceComp: T;
        // if the key doesn't exist yet
        if (!this.has(entityId)) {
            // get the key and index of the first zeroed component in the values array
            index = this.getIndexOfFirstAvailableSpot();
            if (index === -1) {
                throw new Error("no free slot available, please resize the pool");
            } else {
                // add the key of our newly created component and
                this._keys.set(entityId, index);
                this._nbCreated += 1;
                if (active) {
                    this._nbActive += 1;
                } else {
                    this._nbInactive += 1;
                }
                // replace all propreties value from the zeroed component
                toReplaceComp = this._values[index];
            }
        } else {
            index = this._keys.get(entityId);
            // replace all propreties value from the component to update
            toReplaceComp = this._values[index];
            if (toReplaceComp.active !== active) {
                if (active) {
                    this._nbActive += 1;
                    this._nbInactive -= 1;
                } else {
                    this._nbActive -= 1;
                    this._nbInactive += 1;
                }
            }
        }
        toReplaceComp.entityId = entityId;
        toReplaceComp.active = active;

        // lastly increment the lastActiveIndex
        this.incrementCreatedLength(index);
        return this._values[index];
    }

    public delete(entityId: number): boolean {
        const index = this._keys.get(entityId);
        if (index === undefined) { return false; }
        // update nbActive/Inactive counter
        if (this._values[index].active) {
            this._nbActive -= 1;
        } else {
            this._nbInactive -= 1;
        }
        // zeroed the component
        this.mapObject(this._values[index], this._zeroedRef);
        this._values[index].entityId = 0;

        this._keys.delete(entityId);

        this.decrementCreatedLength(index);

        this._nbCreated -= 1;

        return true;
    }

    public recycle(indexComponentToReplace: number, componentRef) {
        // parsing Date ?
        // parsing Function ?
        const prop = JSON.parse(JSON.stringify(componentRef));
        this._values[indexComponentToReplace] = Object.create(componentRef);
        Object.keys(componentRef).forEach((p) => {
            this._values[indexComponentToReplace][p] = prop[p];
        });
    }

    public resize(size: number) {
        let dif = size - this.size;
        if (dif > 0) {
            const oldL = this._values.length;
            this._values.length += dif;
            for (let i = 0; i < dif; ++i) {
                this.createZeroedComponentAt(oldL + i);
            }
        } else if (dif < 0) {
            dif = Math.abs(dif);
            for (let i = 0; i < dif; ++i) {
                const toDelete = this._values[this._values.length - 1];
                this._keys.delete(toDelete.entityId);
                this._values.pop();
            }
        }
        this._size += dif;
    }

    // overwrite fastIterationMap method we don't want to use
    public insertAfter(key: number, value: T, keyRef: number): boolean {
        return false;
    }
    public insertBefore(key: number, value: T, keyRef: number): boolean {
        return false;
    }

    protected createZeroedComponentAt(index: number) {
        this.recycle(index, this._zeroedRef);
        this._values[index].entityId = 0;
        this._values[index].active = false;
    }

    protected getIndexOfFirstAvailableSpot(): number {
        const l = this._values.length;
        for (let i = 0; i < l; ++i) {
            if (this._values[i].entityId === 0) {
                return i;
            }
        }
        return -1;
    }

    protected mapObject(oldC: T, newC: T) {
        for (const i in newC) {
            if (oldC.hasOwnProperty(i)) {
                oldC[i] = newC[i];
            }
        }
    }

    protected decrementCreatedLength(inputIndex: number) {
        if (inputIndex >= this._iterationLength - 1) {
            this._iterationLength -= 1;
        }
    }

    protected incrementCreatedLength(inputIndex: number) {
        if (inputIndex >= this._iterationLength) {
            this._iterationLength += 1;
        }
    }

    get iterationLength(): number {
        return this._iterationLength;
    }

    get nbActive(): number {
        return this._nbActive;
    }

    get nbInactive(): number {
        return this._nbInactive;
    }

    get nbCreated(): number {
        return this._nbCreated;
    }

    get nbFreeSlot(): number {
        return this._size - this._nbActive - this._nbInactive;
    }
}

class EntityFactory implements IEntityFactory {
    protected _factories: Map<string, ComponentFactory<IComponent>>;
    constructor(protected _size: number) {
        this._factories = new Map();
    }

    public activate(entityId: number, value: boolean, factoriesName?: string[]) {
        if (factoriesName) {
            factoriesName.forEach((f) => {
                const ff = this.getFactory(f);
                if (ff) {
                    ff.activate(entityId, value);
                }
            });
        } else {
            this._factories.forEach((f) => {
                f.activate(entityId, value);
            });
        }
    }

    public activateAll(value: boolean) {
        this._factories.forEach((f) => {
            f.activateAll(value);
        });
    }

    public addFactory(name: string, factory: ComponentFactory<IComponent>) {
        if (factory.size !== this._size) {
            factory.resize(this._size);
        }
        this._factories.set(name, factory);
    }

    public getComponent(entityId: number, factoryName: string): IComponent {
        const f = this._factories.get(factoryName);
        if (f) {
            return f.get(entityId);
        } else {
            return undefined;
        }
    }

    public getFactory(name: string): ComponentFactory<IComponent> {
        return this._factories.get(name);
    }

    public delete(entityId: number): boolean {
        let d = true;
        this._factories.forEach((f) => {
            if (!f.delete(entityId)) {
                d = false;
            }
        });
        // false if no factories
        return this._factories.size > 0 && d;
    }

    public get(entityId: number): IComponent[] {
        const e = [];
        this._factories.forEach((f) => {
            e.push(f.get(entityId));
        });
        return e;
    }

    public has(entityId: number): boolean {
        const it = this._factories.entries();
        return it.next().value[1].has(entityId);
    }

    public create(entityId: number, active: boolean) {
        this._factories.forEach((f) => {
            f.create(entityId, active);
        });
    }

    public resize(size: number) {
        this._factories.forEach((f) => {
            f.resize(size);
        });
        this._size = size;
    }

    get iterationLength(): number {
        // return iteratorLength of the first factory;
        const it = this._factories.entries();
        return it.next().value[1].iterationLength;
    }

    get nbActive(): number {
        const it = this._factories.entries();
        return it.next().value[1].nbActive;
    }

    get nbCreated(): number {
        const it = this._factories.entries();
        return it.next().value[1].nbCreated;
    }

    get nbFreeSlot(): number {
        const it = this._factories.entries();
        return it.next().value[1].nbFreeSlot;
    }

    get nbInactive(): number {
        const it = this._factories.entries();
        return it.next().value[1].nbInactive;
    }

    get size(): number {
        return this._size;
    }
}
