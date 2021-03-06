import { interfaces, System } from "ecs-framework";
export { SortSystem };
interface IP {
    paramName: string;
}
declare class SortSystem extends System<IP & interfaces.IComponent> {
    protected sort: (input: interfaces.IComponent[], length: number, paramToSort: string) => {
        id: number;
        s: number;
    }[];
    constructor();
    process(): void;
    execute(): void;
    setParamSource<C extends interfaces.IComponent>(paramName: "paramName", pool: interfaces.IComponentFactory<C>, paramNameInSource: keyof C): void;
    validateParametersSources(): true | Error;
    protected insertionSort(input: interfaces.IComponent[], length: number, paramToSort: string): Array<{
        id: number;
        s: number;
    }>;
}
