import { FastIterationMap } from "FastIterationMap";
export { ComponentFactory, EntityFactory, IComponent, IComponentFactory, IEntityFactory, IPool };
interface IComponent {
    entityId: number;
    active: boolean;
}
interface IPool {
    iterationLength: number;
    nbActive: number;
    nbCreated: number;
    nbFreeSlot: number;
    nbInactive: number;
    size: number;
    create(entityId: number, active: boolean): any;
    delete(entityId: number): boolean;
    get(entityId: number): any;
    has(entityId: number): boolean;
    resize(size: number): any;
}
interface IComponentFactory<T extends IComponent> extends IPool {
    keys: Map<number, number>;
    length: number;
    values: T[];
    push(key: number, value: T): any;
    set(key: number, value: T): any;
    activate(entityId: number, value: boolean): any;
    clear(): any;
    swap(key1: number, key2: number): any;
}
interface IEntityFactory extends IPool {
    addFactory(name: string, factory: IComponentFactory<IComponent>): any;
    getComponent(entityId: number, factoryName: string): IComponent;
    getFactory(name: string): IComponentFactory<IComponent>;
}
declare class ComponentFactory<T extends IComponent> extends FastIterationMap<number, T> implements IComponentFactory<T> {
    protected _size: number;
    protected _iterationLength: number;
    protected _zeroedRef: T;
    protected _nbActive: number;
    protected _nbInactive: number;
    protected _nbCreated: number;
    constructor(_size: number, componentType: {
        new (entityId: number, active: boolean, ...args: any[]): T;
    }, ...args: any[]);
    activate(entityId: number, value: boolean): void;
    activateAll(value: boolean): void;
    clear(): void;
    create(entityId: number, active: boolean, ...args: any[]): T;
    delete(entityId: number): boolean;
    recycle(indexComponentToReplace: number, componentRef: any): void;
    resize(size: number): void;
    insertAfter(key: number, value: T, keyRef: number): boolean;
    insertBefore(key: number, value: T, keyRef: number): boolean;
    protected createZeroedComponentAt(index: number): void;
    protected getIndexOfFirstAvailableSpot(): number;
    protected mapObject(oldC: T, newC: T): void;
    protected decrementCreatedLength(inputIndex: number): void;
    protected incrementCreatedLength(inputIndex: number): void;
    readonly iterationLength: number;
    readonly nbActive: number;
    readonly nbInactive: number;
    readonly nbCreated: number;
    readonly nbFreeSlot: number;
}
declare class EntityFactory implements IEntityFactory {
    protected _size: number;
    protected _factories: Map<string, ComponentFactory<IComponent>>;
    constructor(_size: number);
    activate(entityId: number, value: boolean, factoriesName?: string[]): void;
    activateAll(value: boolean): void;
    addFactory(name: string, factory: ComponentFactory<IComponent>): void;
    getComponent(entityId: number, factoryName: string): IComponent;
    getFactory(name: string): ComponentFactory<IComponent>;
    delete(entityId: number): boolean;
    get(entityId: number): IComponent[];
    has(entityId: number): boolean;
    create(entityId: number, active: boolean): void;
    resize(size: number): void;
    readonly iterationLength: number;
    readonly nbActive: number;
    readonly nbCreated: number;
    readonly nbFreeSlot: number;
    readonly nbInactive: number;
    readonly size: number;
}
