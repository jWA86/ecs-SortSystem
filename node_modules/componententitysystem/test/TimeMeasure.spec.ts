import { expect } from "chai";
import "mocha";
import { ComponentFactory, EntityFactory } from "../src/ComponentFactory";
import { TimeMeasure } from "../src/TimeMeasure";
import { setInterval, clearInterval } from "timers";
// The goal of this class is to give quick feedback of time performance while developping systems or composing them
// it's not supposed to replace a frame profiler
describe("TimeMeasure should be able to ", () => {
    beforeEach(() => {
        window.performance.clearMeasures();
    });
    it("place starting and ending mark and measure time between those marks", (done) => {
        const runFor = 1000;
        const tm = new TimeMeasure("test");
        tm.placeStartMark();
        const t = setTimeout(() => {
            tm.placeEndingMark();
            tm.measure();
            expect(tm.data[0].duration).to.be.gte(runFor);
            clearTimeout(t);
            done();
        }, runFor);
    });
    it("compute a min, max, and mean value from data observation", (done) => {
        const runFor = 100;
        const tm = new TimeMeasure("test");
        let i = 0;
        expect(tm.data.length).to.equal(0);
        tm.placeStartMark();
        const t = setInterval(() => {
            tm.placeEndingMark();
            tm.measure();
            i++;
            if (i >= 10) {
                clearInterval(t);
                tm.computeData();
                let mean = 0;
                tm.data.forEach((d) => {
                    mean += d.duration;
                });
                mean /= tm.data.length;
                expect(tm.data.length).to.equal(i);
                expect(tm.mean).to.equal(mean);
                expect(tm.min).to.approximately(runFor, 10);
                expect(tm.max).to.be.approximately(runFor, 10);
                done();
            }
            tm.placeStartMark();

        }, runFor);

    });
    it("clear data", (done) => {
        const runFor = 100;
        const tm = new TimeMeasure("test");
        let i = 0;
        expect(tm.data.length).to.equal(0);
        tm.placeStartMark();
        const t = setInterval(() => {
            tm.placeEndingMark();
            tm.measure();
            i++;
            if (i >= 10) {
                clearInterval(t);
                expect(tm.data.length).to.be.gte(i);
                tm.clearData();
                expect(tm.data.length).to.equal(0);
                done();
            }
            tm.placeStartMark();

        }, runFor);
    });
});
