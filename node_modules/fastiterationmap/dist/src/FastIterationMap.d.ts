export { FastIterationMap, IFastIterationMap };
interface IFastIterationMap<K, V> {
    keys: Map<K, number>;
    readonly length: number;
    readonly size: number;
    values: V[];
    clear(): any;
    delete(key: K): boolean;
    get(key: K): V;
    has(key: K): boolean;
    insertAfter(key: K, value: V, keyRef: K): boolean;
    insertBefore(key: K, value: V, keyRef: K): boolean;
    swap(key1: K, key2: K): boolean;
    push(key: K, value: V): any;
    set(key: K, value: V): any;
}
declare class FastIterationMap<K, V> implements IFastIterationMap<K, V> {
    protected _keys: Map<K, number>;
    protected _values: V[];
    constructor();
    clear(): void;
    delete(key: K): boolean;
    get(key: K): V;
    has(key: K): boolean;
    insertAfter(key: K, value: V, keyRef: K): boolean;
    insertBefore(key: K, value: V, keyRef: K): boolean;
    readonly keys: Map<K, number>;
    readonly length: number;
    readonly size: number;
    readonly values: V[];
    push(key: K, value: V): number;
    set(key: K, value: V): number;
    swap(key1: K, key2: K): boolean;
    protected insertValue(key: K, value: V, index: number): V[];
    protected offsetIndexInKeys(from: number, offsetVal: number, to?: number): void;
}
