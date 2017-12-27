export { TimeMeasure };
import "performance-polyfill";

class TimeMeasure {
    public performance = this._pollyFillHighResolutionTime();
    protected _id: string;
    protected _startingMark: string;
    protected _endingMark: string;
    protected _min: number = Number.MAX_VALUE;
    protected _max: number = 0;
    protected _mean: number = 0;
    constructor(id: string) {
        this.buildMark(id);
    }
    public buildMark(id: string) {
        this._id = id;
        this._startingMark = id + "-start";
        this._endingMark = id + "-end";
    }
    public placeStartMark() {
        this.performance.mark(this._startingMark);
    }
    public placeEndingMark() {
        this.performance.mark(this._endingMark);
    }
    public measure() {
        this.performance.measure(this._id, this._startingMark, this._endingMark);
    }
    public clearData() {
        this.performance.clearMeasures(this._id);
    }
    /* Set the max, min, and mean value from the performance.measure data set */
    public computeData() {
        const measures = this.performance.getEntriesByName(this._id);
        const l = measures.length;
        let min = Number.MAX_VALUE;
        let max = 0;
        let mean = 0;
        for (let i = 0; i < l; ++i) {
            const d = measures[i].duration;
            if (d < min) {
                min = d;
            }
            if (d > max) {
                max = d;
            }
            mean += d;
        }
        mean /= l;
        this._mean = mean;
        this._max = max;
        this._min = min;
    }

    get data() {
        return this.performance.getEntriesByName(this._id);
    }
    get mean() {
        return this._mean;
    }
    get min() {
        return this._min;
    }
    get max() {
        return this._max;
    }
    // temporary, should find / make a polyfill
    protected _pollyFillHighResolutionTime() {
        return window.performance;
    }
}
