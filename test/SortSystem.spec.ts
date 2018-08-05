import { assert, expect } from "chai";
import { ComponentFactory, interfaces } from "ecs-framework";
import "mocha";

import { SortSystem } from "../src/SortSystem";

describe("SortSystem", () => {
    class Layer implements interfaces.IComponent {
        public entityId: number = 0;
        public active: boolean = true;
        constructor(public zIndex: number) { }
    }
    const defaultLayer = new Layer(0);
    it("should be able to sort component based on a parameter name", () => {

        const layerFactory = new ComponentFactory<Layer>(5, defaultLayer);
        const c1 = layerFactory.create(1, true);
        c1.zIndex = 3;
        const c2 = layerFactory.create(2, true);
        c2.zIndex = 2;
        const c3 = layerFactory.create(3, true);
        c3.zIndex = 1;
        const c4 = layerFactory.create(4, true);
        c4.zIndex = 0;
        const arrayToSort = [c1, c2, c3, c4];

        expect(layerFactory.values[0].zIndex).to.equal(3);
        expect(layerFactory.values[1].zIndex).to.equal(2);
        expect(layerFactory.values[2].zIndex).to.equal(1);
        expect(layerFactory.values[3].zIndex).to.equal(0);

        // should give [3, 2, 1, 0]
        const sortSystem = new SortSystem();
        sortSystem.setParamSource("paramName", layerFactory, "zIndex");
        sortSystem.process();

        expect(layerFactory.values[0].zIndex).to.equal(0);
        expect(layerFactory.values[1].zIndex).to.equal(1);
        expect(layerFactory.values[2].zIndex).to.equal(2);
        expect(layerFactory.values[3].zIndex).to.equal(3);
    });
});
