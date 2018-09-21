import { interfaces, System } from "ecs-framework";
export { SortSystem };
interface IP extends interfaces.IComponent {
    paramName: string;
}
declare class SortSystem extends System<IP> {
    protected sort: (input: interfaces.IComponent[], length: number, paramToSort: string) => {
        id: number;
        s: number;
    }[];
    constructor(params: IP);
    process(): void;
    execute(): void;
    setParamSource<C extends interfaces.IComponent>(paramName: "paramName", pool: interfaces.IComponentFactory<C>, paramNameInSource: keyof C): void;
    protected insertionSort(input: interfaces.IComponent[], length: number, paramToSort: string): Array<{
        id: number;
        s: number;
    }>;
}
