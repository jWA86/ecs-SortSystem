import { interfaces, System } from "ecs-framework";
import { IComponent } from "../node_modules/ecs-framework/dist/src/interfaces";
export { SortSystem };

/* Sort components in the pool by a parameter of type number */
class SortSystem extends System<{paramName: string }> {
    protected sort = this.insertionSort;
    protected _defaultParameter = { paramName: "param" };
    constructor(paramNameToSortBy: string) {
        super();
        // System.init won't set parametersSource since the parameter passed by the constructor and set from the System generic
        // this allow to change the parameter name to sort by at runtime without instantiating a new
        this.parametersSource.set("paramName", {key: "paramName", source: undefined, keyInSource: paramNameToSortBy as keyof IComponent});
    }
    public process() {
        // const pool = this.factories[0];
        const paramInfo = this.parametersSource.get("paramName");
        const pool = paramInfo.source;
        const sortedIndex = this.sort(pool.values, pool.activeLength, paramInfo.keyInSource);
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
    public execute() { }

    /* Return an array sorted in ascending order of id and the value of the sorting parameter */
    protected insertionSort(input: interfaces.IComponent[], length: number, paramToSort: string): Array<{ id: number, s: number }> {
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
