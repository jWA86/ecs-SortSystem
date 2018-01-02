import { IComponent, System } from "ecs-framework";
export { SortSystem };
declare class SortSystem extends System {
    paramName: string;
    protected sort: (input: IComponent[], length: number, paramToSort: string) => {
        id: number;
        s: number;
    }[];
    constructor(paramName: string);
    process(args?: any[]): void;
    execute(c: {
        id: string;
        active: boolean;
        int: number;
    }): void;
    protected insertionSort(input: IComponent[], length: number, paramToSort: string): Array<{
        id: number;
        s: number;
    }>;
}
