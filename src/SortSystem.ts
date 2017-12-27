import { ComponentFactory, IComponent, IComponentFactory, System } from "componententitysystem";
export { SortSystem };

/* Sort components in the pool by a parameter of type number */
class SortSystem extends System {
    protected sort = this.insertionSort;
    constructor(public paramName: string) { super(); }
    public process(args?: any[]) {
        const pool = this.factories[0];
        const sortedIndex = this.sort(pool.values, pool.iterationLength, this.paramName);
        const l = sortedIndex.length;
        for (let i = 0; i < sortedIndex.length; ++i) {
            const pId = pool.values[i].entityId;
            const sId = sortedIndex[i].id;
            if (sId !== pId) {
                pool.swap(pId, sId);
            }
        }
    }

    /* Not use as the sorting is done in the process method */
    public execute(c: { id: string, active: boolean, int: number }) { }

    /* Return an array sorted in ascending order of id and the value of the sorting parameter */
    protected insertionSort(input: IComponent[], length: number, paramToSort: string): Array<{ id: number, s: number }> {
        const sorted = [];
        sorted.push({ id: input[0].entityId, s: input[0][paramToSort] });
        for (let i = 1; i < length; ++i) {
            const tmp = { id: input[i].entityId, s: input[i][paramToSort] };
            let k = i - 1;
            for (k; k >= 0 && (sorted[k].s > tmp.s); --k) {
                sorted[k + 1] = sorted[k];
            }
            sorted[k + 1] = tmp;
        }
        return sorted;
    }
}
