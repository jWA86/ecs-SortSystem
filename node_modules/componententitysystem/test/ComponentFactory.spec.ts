import { expect } from "chai";
import "mocha";
import { ComponentFactory, EntityFactory } from "../src/ComponentFactory";
import { IComponent, IComponentFactory } from "../src/interfaces";

describe("Component Factory", () => {
    class ConcreteComponent implements IComponent {
        constructor(public entityId: number, public active: boolean) { }
    }
    class MultiPropComponent implements IComponent {
        constructor(public entityId: number, public active: boolean, public prop1: string, public prop2: number, public prop3: { x: number, y: number }) { }
    }

    let simpleFactory = new ComponentFactory<MultiPropComponent>(5, MultiPropComponent, "default string", "default string", { x: 0.0, y: 0.0 });
    beforeEach(() => {
        simpleFactory = new ComponentFactory<MultiPropComponent>(5, MultiPropComponent, "default string", "default string", { x: 0.0, y: 0.0 });
    });
    it("should be able to retrieve a component by entity id", () => {
        const c = simpleFactory.create(1, true);
        const c2 = simpleFactory.create(2, true);
        const fetchedC = simpleFactory.get(c2.entityId);
        expect(fetchedC.entityId).to.equal(c2.entityId);
        // undefined if id not found
        const fetchedC2 = simpleFactory.get(123456);
        expect(fetchedC2).to.equal(undefined);
    });
    it("should be able to recycle zeroed components to create new one", () => {
        const mc = simpleFactory.create(1, true);
        expect(mc.entityId).to.equal(1);
        expect(mc.prop1).to.equal("default string");
        expect(mc.prop2).to.equal("default string");
        expect(mc.prop3.x).to.equal(0.0);
        expect(mc.prop3.y).to.equal(0.0);

        mc.prop3.x = 1.0;
        for (let i = 1; i < simpleFactory.length; ++i) {
            expect(simpleFactory.values[i].prop3.x).to.equal(0.0);
        }
    });
    it("zeroed component should not share references", () => {
        simpleFactory.values[0].prop3.x += 1.0;
        expect(simpleFactory.values[1].prop3.x).to.not.equal(simpleFactory.values[0].prop3.x);
    });
    it("should be able to create a number of zeroed components at instanciation ", () => {
        const factory = new ComponentFactory<IComponent>(5, ConcreteComponent );
        expect(factory.values.length).to.equal(5);
    });
    it("zeored component should have a key starting by 0", () => {
        const factory = new ComponentFactory<IComponent>(5, ConcreteComponent);
        for (let i = 0; i < 5; ++i) {
            expect(factory.values[i].entityId).to.equal(0);
        }
    });
    it("should be able to provid zeroed value for component proreties ", () => {

        for (let i = 0; i < 5; ++i) {
            expect(simpleFactory.values[i].prop1).to.equal("default string");
            expect(simpleFactory.values[i].prop2).to.equal("default string");
            expect(simpleFactory.values[i].prop3.x).to.equal(0.0);
            expect(simpleFactory.values[i].prop3.y).to.equal(0.0);
        }
    });
    it("zeroed component should be inactive ", () => {
        for (let i = 0; i < 5; ++i) {
            expect(simpleFactory.values[i].active).to.equal(false);
        }
    });
    it("zeroed component should not be referenced in the key map", () => {
        const factory = new ComponentFactory<IComponent>(5, ConcreteComponent);
        expect(factory.values.length).to.equal(5);
        expect(factory.keys.size).to.equal(0);

    });
    it("created components should be created at the first spot available ", () => {
        simpleFactory.create(1, false, "p1", 2, { x: 1, y: 3 });
        expect(simpleFactory.size).to.equal(5);
        expect(simpleFactory.values[0].entityId).to.equal(1);
    });
    it("creating 2 components with the same entity Id should create only one component ", () => {
        const initialSize = simpleFactory.size;
        const c = simpleFactory.create(1, false, "p1", 2, { x: 0.0, y: 0.0 });
        const noUsedVariable = expect(c.entityId).to.not.be.null;
        expect(simpleFactory.values[0].entityId).to.equal(c.entityId);
        const c2 = simpleFactory.create(1, false, "p2", 3, { x: 1.0, y: 1.0 });
        expect(c2.entityId).to.equal(c.entityId);
        expect(simpleFactory.values[0].entityId).to.equal(c.entityId);
        expect(simpleFactory.size).to.equal(initialSize);
        expect(simpleFactory.get(1).prop1).to.equal(c2.prop1);
    });
    it("should increment the createdLength only if the components is created at an index greater than createdLength", () => {
        expect(simpleFactory.iterationLength).to.equal(0);
        simpleFactory.create(1, false, "p1", 2, { x: 0.0, y: 0.0 });
        expect(simpleFactory.iterationLength).to.equal(1);
        simpleFactory.create(2, false, "p1", 2, { x: 0.0, y: 0.0 });
        expect(simpleFactory.iterationLength).to.equal(2);
        simpleFactory.create(1, false, "p1", 3, { x: 0.0, y: 0.0 });
        expect(simpleFactory.iterationLength).to.equal(2);
    });
    it("should zeroed the component when we 'remove' ", () => {
        const initialSize = simpleFactory.size;
        simpleFactory.create(1, false, "p1", 2, { x: 0.0, y: 0.0 });
        expect(simpleFactory.has(1)).to.equal(true);
        // id should be found in order to delete it first
        expect(simpleFactory.delete(1)).to.equal(true);
        // size of the pool should not be changed since we zeroed the component instead of removing it from the pool
        expect(simpleFactory.size).to.equal(initialSize);
        // we created only one component so it was at the first index of the values array, it is now zeroed
        expect(simpleFactory.values[0].entityId).to.equal(0);
        // the component should not be referenced anymore
        expect(simpleFactory.has(1)).to.equal(false);
    });
    it("removed components should decrement the createdLength only if it is the last one ", () => {
        const initialSize = simpleFactory.size;
        simpleFactory.create(1, false, "p1", 2, { x: 0.0, y: 0.0 });
        expect(simpleFactory.iterationLength).to.equal(1);
        expect(simpleFactory.delete(1)).to.equal(true);
        expect(simpleFactory.iterationLength).to.equal(0);

        simpleFactory.create(1, false, "p1", 2, { x: 0.0, y: 0.0 });
        simpleFactory.create(2, false, "p1", 2, { x: 0.0, y: 0.0 });
        expect(simpleFactory.iterationLength).to.equal(2);
        expect(simpleFactory.delete(1)).to.equal(true);
        // still equal 2 since the one we removed is not the last one
        expect(simpleFactory.iterationLength).to.equal(2);
    });
    it("should be able to create components with an active proprety and other proreties", () => {
        const mcFactory = new ComponentFactory<MultiPropComponent>(2, MultiPropComponent, "default string", "default string", { x: 0.0, y: 0.0 });
        const mc = mcFactory.create(1, true);
        expect(mc.active).to.equal(true);
        expect(mc.entityId).to.equal(1);
        expect(mc.prop1).to.equal("default string");
        expect(mc.prop2).to.equal("default string");
        expect(mc.prop3.x).to.equal(0.0);
        expect(mc.prop3.y).to.equal(0.0);
        const mc2 = mcFactory.create(1, false);
        expect(mc2.active).to.equal(false);
    });
    it("should be able to active all created components", () => {
        simpleFactory.create(1, false);
        simpleFactory.create(2, false);
        simpleFactory.activateAll(true);
        expect(simpleFactory.values[0].active).to.equal(true);
        expect(simpleFactory.values[1].active).to.equal(true);
    });
    it("should be able to desactivate all created components", () => {
        simpleFactory.create(1, true);
        simpleFactory.create(2, true);
        simpleFactory.activateAll(false);
        expect(simpleFactory.values[0].active).to.equal(false);
        expect(simpleFactory.values[1].active).to.equal(false);
    });
    it("should keep track of the nb of created components", () => {
        expect(simpleFactory.nbCreated).to.equal(0);
        simpleFactory.create(1, false);
        expect(simpleFactory.nbCreated).to.equal(1);
        simpleFactory.create(2, true);
        expect(simpleFactory.nbCreated).to.equal(2);
        simpleFactory.create(2, true);
        expect(simpleFactory.nbCreated).to.equal(2);

        simpleFactory.delete(2);
        expect(simpleFactory.nbCreated).to.equal(1);
        simpleFactory.delete(1);
        expect(simpleFactory.nbCreated).to.equal(0);
    });
    it("should keep track of the number of active components", () => {
        expect(simpleFactory.nbActive).to.equal(0);
        simpleFactory.create(1, true);
        expect(simpleFactory.nbActive).to.equal(1);
        simpleFactory.create(2, true);
        expect(simpleFactory.nbActive).to.equal(2);
        simpleFactory.create(2, true);
        expect(simpleFactory.nbActive).to.equal(2);
        simpleFactory.create(2, false);
        expect(simpleFactory.nbActive).to.equal(1);
        simpleFactory.create( 3, false);
        expect(simpleFactory.nbActive).to.equal(1);

        simpleFactory.create(4, true);
        expect(simpleFactory.nbActive).to.equal(2);

        simpleFactory.delete(2);
        expect(simpleFactory.nbActive).to.equal(2);
        simpleFactory.delete(1);
        expect(simpleFactory.nbActive).to.equal(1);

        simpleFactory.activate(4, false);
        expect(simpleFactory.nbActive).to.equal(0);

        simpleFactory.activateAll(true);
        expect(simpleFactory.nbActive).to.equal(simpleFactory.nbCreated);
    });
    it("should keep track of the number of inactive components", () => {

        expect(simpleFactory.nbInactive).to.equal(0);
        simpleFactory.create(1, true);
        expect(simpleFactory.nbInactive).to.equal(0);
        simpleFactory.create(2, false);
        expect(simpleFactory.nbInactive).to.equal(1);
        simpleFactory.create(2, false);
        expect(simpleFactory.nbInactive).to.equal(1);
        simpleFactory.create(2, true);
        expect(simpleFactory.nbInactive).to.equal(0);
        simpleFactory.create(3, false);
        expect(simpleFactory.nbInactive).to.equal(1);

        simpleFactory.create(4, false);
        expect(simpleFactory.nbInactive).to.equal(2);

        simpleFactory.delete(2);
        expect(simpleFactory.nbInactive).to.equal(2);
        simpleFactory.delete(3);
        expect(simpleFactory.nbInactive).to.equal(1);

        simpleFactory.activate(4, true);
        expect(simpleFactory.nbInactive).to.equal(0);

        simpleFactory.activateAll(false);
        expect(simpleFactory.nbInactive).to.equal(simpleFactory.nbCreated);
    });
    it("should keep track of the number of free slot", () => {

        expect(simpleFactory.nbFreeSlot).to.equal(5);
        simpleFactory.create(1, true);
        expect(simpleFactory.nbFreeSlot).to.equal(4);
        simpleFactory.create(2, false);
        expect(simpleFactory.nbFreeSlot).to.equal(3);
        simpleFactory.create( 2, true);
        expect(simpleFactory.nbFreeSlot).to.equal(3);
    });
    it("resize the pool down", () => {
        expect(simpleFactory.size).to.equal(5);
        simpleFactory.resize(3);
        expect(simpleFactory.size).to.equal(3);
        for (let i = 0; i < simpleFactory.size; ++i) {
            expect(simpleFactory[i]).to.equal(undefined);
        }
    });
    it("resize the pool up", () => {
        expect(simpleFactory.size).to.equal(5);
        simpleFactory.resize(10);
        expect(simpleFactory.size).to.equal(10);
        for (let i = 0; i < simpleFactory.size; ++i) {
            expect(simpleFactory.values[i].entityId).to.equal(0);
        }
        // make sure object in component are distinct copy and not a reference
        simpleFactory.values[simpleFactory.size - 1].prop3.x += 1;
        expect(simpleFactory.values[simpleFactory.size - 2].prop3.x).to.not.equal(simpleFactory.values[simpleFactory.size - 1].prop3.x);
    });
    it("clear should remove everyting from the pool", () => {
        simpleFactory.create(1, true);
        simpleFactory.create(2, false);
        expect(simpleFactory.size).to.equal(5);
        simpleFactory.clear();
        expect(simpleFactory.size).to.equal(0);
    });

    describe("Parallel Pool", () => {

        class PositionComponent implements IComponent {
            constructor(public entityId: number, public active: boolean, public position = { x: 0.0, y: 0.0, z: 0.0 }) { }
        }

        class VelocityComponent implements IComponent {
            constructor(public entityId, public active, public vec = { x: 0.0, y: 0.0, z: 0.0 }) { }
        }

        let positionFactory;
        let velocityFactory;
        let movingObjectFactory;

        beforeEach(() => {
            positionFactory = new ComponentFactory<PositionComponent>(5, PositionComponent, { x: 0.0, y: 0.0, z: 0.0 });
            velocityFactory = new ComponentFactory<VelocityComponent>(5, VelocityComponent, { x: 0.0, y: 0.0, z: 0.0 });
            movingObjectFactory = new EntityFactory(10);

            movingObjectFactory.addFactory("position", positionFactory);
            movingObjectFactory.addFactory("velocity", velocityFactory);
        });

        it("addFactory() should set the same size as specified in the entityFactory constructor", () => {
            expect(movingObjectFactory.size).to.equal(10);
            expect(positionFactory.size).to.equal(10);
            expect(velocityFactory.size).to.equal(10);
        });
        it("getFactory() should return the factory corresponding to the name", () => {
            // check the first component to be an instance of what the factory is supposed to hold
            expect(movingObjectFactory.getFactory("position").values[0]).to.be.an.instanceOf(PositionComponent);
        });
        it("create() should create a component in each child pool with the same entityId", () => {
            movingObjectFactory.create(1, true);
            expect(movingObjectFactory.getFactory("position").get(1).entityId).to.equal(1);
            expect(movingObjectFactory.getFactory("velocity").get(1).entityId).to.equal(1);
        });
        it("delete() should remove the components in every child pool", () => {
            movingObjectFactory.create(1, true);

            expect(movingObjectFactory.delete(1)).to.equal(true);
            expect(positionFactory.has(1)).to.equal(false);
            expect(velocityFactory.has(1)).to.equal(false);
        });
        it("delete() unexisting component should return false", () => {
            expect(movingObjectFactory.delete(1)).to.equal(false);
            expect(positionFactory.has(1)).to.equal(false);
            expect(velocityFactory.has(1)).to.equal(false);
        });
        it("resize() should resize all child pool", () => {
            movingObjectFactory.resize(10);
            expect(positionFactory.size).to.equal(10);
            expect(velocityFactory.size).to.equal(10);
            expect(movingObjectFactory.size).to.equal(10);

            movingObjectFactory.resize(3);
            expect(positionFactory.size).to.equal(3);
            expect(velocityFactory.size).to.equal(3);
            expect(movingObjectFactory.size).to.equal(3);
        });
        it("iterationLength should be the same for all pool", () => {
            expect(movingObjectFactory.iterationLength).to.equal(0);
            expect(positionFactory.iterationLength).to.equal(0);
            expect(velocityFactory.iterationLength).to.equal(0);

            movingObjectFactory.create(1, true);
            movingObjectFactory.create(2, true);

            expect(movingObjectFactory.iterationLength).to.equal(2);
            expect(positionFactory.iterationLength).to.equal(2);
            expect(velocityFactory.iterationLength).to.equal(2);
        });
        it("has() should return true or false", () => {
            expect(movingObjectFactory.has(1)).to.equal(false);

            movingObjectFactory.create(1, true);
            movingObjectFactory.create(2, true);

            expect(movingObjectFactory.has(2)).to.equal(true);
        });
        it("getComponent() should return the component", () => {
            // non existing entityId
            expect(movingObjectFactory.getComponent(2, "position")).to.equal(undefined);

            movingObjectFactory.create(1, true);
            expect(movingObjectFactory.getComponent(1, "position")).to.have.property("position");
            expect(movingObjectFactory.getComponent(1, "velocity")).to.have.property("vec");
            // non existing factory name
            expect(movingObjectFactory.getComponent(1, "nonExistingName")).to.equal(undefined);
        });
        it("get() return the entity's components", () => {
            movingObjectFactory.create(1, true);
            const myC1 = movingObjectFactory.get(1);
            expect(myC1.length).to.equal(2);
            expect(myC1[0]).to.have.property("position");
            expect(myC1[1]).to.have.property("vec");
        });
        it("nbCreated", () => {
            expect(movingObjectFactory.nbCreated).to.equal(0);
            movingObjectFactory.create(1, false);
            expect(movingObjectFactory.nbCreated).to.equal(1);
            movingObjectFactory.delete(1);
            expect(movingObjectFactory.nbCreated).to.equal(0);
        });
        it("nbFreeSlot", () => {
            expect(movingObjectFactory.nbFreeSlot).to.equal(movingObjectFactory.size);
            movingObjectFactory.create(1, false);
            expect(movingObjectFactory.nbFreeSlot).to.equal(movingObjectFactory.size - 1);
        });
        it("nbActive", () => {
            expect(movingObjectFactory.nbActive).to.equal(0);
            movingObjectFactory.create(1, true);
            expect(movingObjectFactory.nbActive).to.equal(1);
            movingObjectFactory.create(2, false);
            expect(movingObjectFactory.nbActive).to.equal(1);
        });
        it("nbInactive", () => {
            expect(movingObjectFactory.nbInactive).to.equal(0);
            movingObjectFactory.create(1, true);
            expect(movingObjectFactory.nbInactive).to.equal(0);
            movingObjectFactory.create(1, false);
            expect(movingObjectFactory.nbInactive).to.equal(1);
        });
        it("activate all components", () => {
            movingObjectFactory.create(1, true);
            movingObjectFactory.create(2, true);
            movingObjectFactory.create(3, false);

            movingObjectFactory.activateAll(false);
            for (let i = 1; i < movingObjectFactory.nbCreated + 1; ++i) {
                movingObjectFactory.get(i).forEach((c) => {
                    expect(c.active).to.equal(false);
                });
            }

            movingObjectFactory.activateAll(true);
            for (let i = 1; i < movingObjectFactory.nbCreated + 1; ++i) {
                movingObjectFactory.get(i).forEach((c) => {
                    expect(c.active).to.equal(true);
                });
            }
        });
        it("activate should mopdify the activate proprety of all the components of the entity", () => {
            movingObjectFactory.create(1, true);
            movingObjectFactory.create(2, false);

            movingObjectFactory.activate(1, false);
            movingObjectFactory.get(1).forEach((c) => {
                expect(c.active).to.equal(false);
            });

            movingObjectFactory.activate(2, true);
            movingObjectFactory.get(2).forEach((c) => {
                expect(c.active).to.equal(true);
            });

        });
        it("activate with factories name should modify activate proprety of the corresponding components only", () => {
            movingObjectFactory.create(1, true);
            movingObjectFactory.create(2, false);

            movingObjectFactory.activate(1, false, ["position"]);

            expect(movingObjectFactory.getComponent(1, "position").active).to.equal(false);
            expect(movingObjectFactory.getComponent(1, "velocity").active).to.equal(true);

            movingObjectFactory.activate(2, true, ["position", "velocity"]);
            expect(movingObjectFactory.getComponent(2, "position").active).to.equal(true);
            expect(movingObjectFactory.getComponent(2, "velocity").active).to.equal(true);

        });
    });
});
