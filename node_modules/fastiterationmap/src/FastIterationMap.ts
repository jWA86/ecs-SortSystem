
export { FastIterationMap, IFastIterationMap };

interface IFastIterationMap<K, V> {
    keys: Map<K, number>;
    readonly length: number;
    readonly size: number;
    values: V[];
    clear();
    delete(key: K): boolean;
    get(key: K): V;
    has(key: K): boolean;
    insertAfter(key: K, value: V, keyRef: K): boolean;
    insertBefore(key: K, value: V, keyRef: K): boolean;
    swap(key1: K, key2: K): boolean;
    // Provide for reading keys only, should not be modified outside the class
    push(key: K, value: V);
    set(key: K, value: V);
}

class FastIterationMap<K, V> implements IFastIterationMap<K, V> {
    // _keys store the index of the element which is stored in the _values array
    // keys are not in the same order as values, therefore it shouldn't be use outside the class
    protected _keys: Map<K, number>;
    protected _values: V[];
    constructor() {
        this._keys = new Map<K, number>();
        this._values = [];
    }
    public clear(): void {
        this._keys.clear();
        this._values = [];
    }
    public delete(key: K): boolean {
        const i = this._keys.get(key);
        const r = this._keys.delete(key);
        this.offsetIndexInKeys(i, -1);
        const r2 = this._values.splice(i, 1);
        if (r2.length > 0 && r) {
            return true;
        } else {
            return false;
        }
    }
    public get(key: K): V {
        return this._values[this._keys.get(key)];
    }
    public has(key: K): boolean {
        return this._keys.has(key);
    }

    public insertAfter(key: K, value: V, keyRef: K): boolean {
        if (this._keys.get(key) !== undefined) { return false; }
        const i = this._keys.get(keyRef);
        this.insertValue(key, value, i + 1);
        if (i === undefined) {
            return false;
        } else {
            this.offsetIndexInKeys(i, 1);
            this._keys.set(key, i + 1);
            return true;
        }
    }
    public insertBefore(key: K, value: V, keyRef: K): boolean {
        if (this._keys.get(key) !== undefined) { return false; }
        const i = this._keys.get(keyRef);
        this.insertValue(key, value, i);
        if (i === undefined) {
            return false;
        } else {
            this.offsetIndexInKeys(i - 1, 1);
            this._keys.set(key, i);
            return true;
        }
    }
    get keys(): Map<K, number> {
        return this._keys;
    }
    get length(): number {
        return this._values.length;
    }
    get size(): number {
        return this._values.length;
    }
    get values(): V[] {
        return this._values;
    }
    public push(key: K, value: V): number {
        const e = this._keys.get(key);
        // if the key doesn't exist add the element
        if (e === undefined) {
            const l = this._values.push(value);
            this._keys.set(key, l - 1);
        } else {
            // if the key is already there, update the value
            this._values[e] = value;
        }
        return this._values.length;
    }
    public set(key: K, value: V): number {
        return this.push(key, value);
    }
    public swap(key1: K, key2: K): boolean {
        const index1 = this._keys.get(key1);
        const index2 = this._keys.get(key2);
        if (index1 === undefined || index2 === undefined) {return false; }
        const tmp = this._values[index1];
        this._values[index1] = this._values[index2];
        this._values[index2] = tmp;
        this._keys.set(key1, index2);
        this._keys.set(key2, index1);
        return true;
    }
    protected insertValue(key: K, value: V, index: number): V[] {
        return this._values.splice(index, 0, value);
    }
    // from exclusive
    // to exclusive
    protected offsetIndexInKeys(from: number, offsetVal: number, to?: number): void {
        const mapIter = this._keys.entries();
        const l = this._keys.size;
        to = to || Number.MAX_VALUE;
        for (let i = 0; i < l; ++i) {
            const e = mapIter.next().value;
            if (e[1] > from && e[1] < to) {
                this._keys.set(e[0], e[1] += offsetVal);
            }
        }
    }
}
