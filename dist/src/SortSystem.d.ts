import { interfaces, System } from "ecs-framework";
export { SortSystem };
declare class SortSystem extends System<{
    paramName: string;
}> {
    protected sort: (input: interfaces.IComponent[], length: number, paramToSort: string) => {
        id: number;
        s: number;
    }[];
    protected _defaultParameter: {
        paramName: string;
    };
    constructor(paramNameToSortBy: string);
    process(): void;
    execute(): void;
    protected insertionSort(input: interfaces.IComponent[], length: number, paramToSort: string): Array<{
        id: number;
        s: number;
    }>;
}
