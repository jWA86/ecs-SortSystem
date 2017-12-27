export { TimeMeasure };
import "performance-polyfill";
declare class TimeMeasure {
    performance: Performance;
    protected _id: string;
    protected _startingMark: string;
    protected _endingMark: string;
    protected _min: number;
    protected _max: number;
    protected _mean: number;
    constructor(id: string);
    buildMark(id: string): void;
    placeStartMark(): void;
    placeEndingMark(): void;
    measure(): void;
    clearData(): void;
    computeData(): void;
    readonly data: any;
    readonly mean: number;
    readonly min: number;
    readonly max: number;
    protected _pollyFillHighResolutionTime(): Performance;
}
