import { expect } from "chai";
import "mocha";
import { ComponentFactory, EntityFactory } from "../src/ComponentFactory";
import { IComponent, IComponentFactory, ISystem } from "../src/interfaces";
import { System } from "../src/System";

describe("System ", () => {
    const zeroVec3 = { x: 0.0, y: 0.0, z: 0.0 };

    interface Ivec3 {
        x: number;
        y: number;
        z: number;
    }

    interface IPositionComponent extends IComponent {
        position: { x: number, y: number, z: number };
    }

    interface IVelocityComponent extends IComponent {
        velocity: { x: number, y: number; z: number };
    }

    class PositionComponent implements IComponent {
        constructor(public entityId: number, public active: boolean, public position: Ivec3) { }
    }

    class VelocityComponent implements IComponent {
        constructor(public entityId, public active, public velocity: Ivec3) { }
    }

    class MoveByOneUnitSystem extends System {
        constructor() {
            super();
        }
        public execute(component: PositionComponent) {
            component.position.x += 1.0;
            component.position.y += 1.0;
            component.position.z += 1.0;
        }
    }

    let positionFactory = new ComponentFactory<PositionComponent>(10, PositionComponent, zeroVec3);

    let nbActive = 3;
    let nbInactive = 2;
    let nbZeroed = positionFactory.size - nbActive - nbInactive;

    beforeEach(() => {
        positionFactory = new ComponentFactory<PositionComponent>(10, PositionComponent, zeroVec3);
        nbActive = 3;
        nbInactive = 2;
        nbZeroed = positionFactory.size - nbActive - nbInactive;
        for (let i = 1; i < nbActive + 1; ++i) {
            positionFactory.create(i, true);
        }
        for (let i = nbActive + 1; i < nbInactive + nbActive + 1; ++i) {
            positionFactory.create(i, false);
        }
    });
    it("checking samples used by other tests", () => {

        expect(positionFactory.nbActive).to.equal(nbActive);
        expect(positionFactory.nbInactive).to.equal(nbInactive);
        expect(positionFactory.nbFreeSlot).to.equal(nbZeroed);

        for (let i = 0; i < positionFactory.size; ++i) {
            expect(positionFactory.values[i].position.x).to.equal(0.0);
            expect(positionFactory.values[i].position.y).to.equal(0.0);
            expect(positionFactory.values[i].position.z).to.equal(0.0);

        }
    });
    it("should update active components", () => {

        const s = new MoveByOneUnitSystem();
        s.setFactories(positionFactory);
        s.process();

        for (let i = 0; i < positionFactory.nbActive; ++i) {
            expect(positionFactory.values[i].active).to.equal(true);
            expect(positionFactory.values[i].position.x).to.equal(1.0);
            expect(positionFactory.values[i].position.y).to.equal(1.0);
            expect(positionFactory.values[i].position.z).to.equal(1.0);
        }
    });
    it("should not update inactive components", () => {
        const s = new MoveByOneUnitSystem();
        s.setFactories(positionFactory);
        s.process();
        for (let i = positionFactory.nbActive; i < positionFactory.nbActive + positionFactory.nbInactive; ++i) {
            expect(positionFactory.values[i].active).to.equal(false);
            expect(positionFactory.values[i].position.x).to.equal(0.0);
            expect(positionFactory.values[i].position.y).to.equal(0.0);
            expect(positionFactory.values[i].position.z).to.equal(0.0);
        }
    });
    it("should not update zeroed components", () => {
        for (let i = positionFactory.nbActive + positionFactory.nbInactive; i < positionFactory.size; ++i) {
            expect(positionFactory.values[i].entityId).to.equal(0);
            positionFactory.values[i].active = true;
        }
        const s = new MoveByOneUnitSystem();
        s.setFactories(positionFactory);
        s.process();
        for (let i = positionFactory.nbActive + positionFactory.nbInactive; i < positionFactory.size; ++i) {
            expect(positionFactory.values[i].entityId).to.equal(0);
            expect(positionFactory.values[i].position.x).to.equal(0.0);
            expect(positionFactory.values[i].position.y).to.equal(0.0);
            expect(positionFactory.values[i].position.z).to.equal(0.0);
        }
    });
    // System Manager is responsible for holding system active state
    // it("toggle an active proprety", () => {
    //     const s = new MoveByOneUnitSystem();
    //     expect(s.active).to.equal(true);
    //     s.active = false;
    //     expect(s.active).to.equal(false);
    //     s.active = true;
    //     expect(s.active).to.equal(true);
    // });
    describe("System with multiple components types", () => {

        let velocityFactory: ComponentFactory<VelocityComponent>;

        beforeEach(() => {
            positionFactory = new ComponentFactory<PositionComponent>(5, PositionComponent, zeroVec3);
            velocityFactory = new ComponentFactory<VelocityComponent>(5, VelocityComponent, zeroVec3);

            for (let i = 1; i < positionFactory.size + 1; ++i) {
                positionFactory.create(i, true);
                positionFactory.get(i).position = { x: 1.0, y: 1.0, z: 1.0 };
            }

            for (let i = 1; i < velocityFactory.size + 1; ++i) {
                velocityFactory.create(i, true);
                velocityFactory.get(i).velocity = { x: 2.0, y: 0.0, z: 0.0 };
            }
        });

        describe("non parallel pool", () => {

            class MoveSystem extends System {
                constructor() { super(); }

                public execute(posC: IPositionComponent, veloC: IVelocityComponent) {
                    posC.position.x *= veloC.velocity.x;
                    posC.position.y *= veloC.velocity.y;
                    posC.position.z *= veloC.velocity.z;
                }
            }
            // let positionFactory: ComponentFactory<PositionComponent>;
            // let velocityFactory: ComponentFactory<VelocityComponent>;

            beforeEach(() => {
                positionFactory = new ComponentFactory<PositionComponent>(5, PositionComponent, zeroVec3);
                velocityFactory = new ComponentFactory<VelocityComponent>(5, VelocityComponent, zeroVec3);

                for (let i = 1; i < positionFactory.size + 1; ++i) {
                    positionFactory.create(i, true);
                    const p = positionFactory.get(i);
                    p.position.x = 1.0;
                    p.position.y = 1.0;
                    p.position.z = 1.0;
                }

                for (let i = 1; i < velocityFactory.size + 1; ++i) {
                    velocityFactory.create(i, true);
                    const v = velocityFactory.get(i);
                    v.velocity.x = 2.0;
                    v.velocity.y = 0.0;
                    v.velocity.z = 0.0;
                }
                velocityFactory.delete(5);
                expect(velocityFactory.nbCreated).to.equal(positionFactory.nbCreated - 1);
            });

            it("should iterate on the 1st factory and update its components with components of the 2nd factory", () => {
                const s = new MoveSystem();

                s.setFactories(positionFactory, velocityFactory);
                s.process();

                for (let i = 0; i < positionFactory.size - 1; ++i) {
                    expect(positionFactory.values[i].position.x).to.equal(2.0);
                }
            });
            it("should not update if there is no components with the same entityId", () => {
                expect(positionFactory.nbActive).to.equal(velocityFactory.nbActive + 1);

                const s = new MoveSystem();
                s.setFactories(positionFactory, velocityFactory);
                s.process();
                // last one should not be updated since there is no velocity component associated with.
                expect(positionFactory.values[positionFactory.size - 1].position.x).to.equal(1.0);
            });
        });

        describe("parallel pool system", () => {
            class MoveSystem extends System {
                constructor() {
                    super();
                }
                public execute(pos: PositionComponent, velo: VelocityComponent) {
                    pos.position.x *= velo.velocity.x;
                    pos.position.y *= velo.velocity.y;
                    pos.position.z *= velo.velocity.z;
                }
            }
            beforeEach(() => {
                velocityFactory.create(4, true);
                velocityFactory.get(4).velocity = { x: 2.0, y: 0.0, z: 0.0 };
                expect(velocityFactory.nbCreated).to.equal(positionFactory.nbCreated);
            });
            it("should provide all the components to the execute fonction", () => {

                class ArgTestSystem extends System {
                    constructor() {
                        super();
                    }
                    public execute(pos: PositionComponent, velo: VelocityComponent) {
                        expect(pos).to.be.an.instanceof(PositionComponent);
                        expect(velo).to.be.an.instanceof(VelocityComponent);
                    }
                }
                const ms = new ArgTestSystem();
                ms.setFactories(positionFactory, velocityFactory);
                ms.process();

            });
            it("should update the component in pools specified in the system constructor", () => {
                const ms = new MoveSystem();
                ms.setFactories(positionFactory, velocityFactory);
                ms.process();

                for (let i = 0; i < positionFactory.length; ++i) {
                    expect(positionFactory.values[i].position.x).to.equal(2.0);
                }
            });
            it("use of with an EntityFactory pool", () => {
                const ms = new MoveSystem();
                const movingEntities = new EntityFactory(10);
                movingEntities.addFactory("position", positionFactory);
                movingEntities.addFactory("velocity", velocityFactory);

                ms.setFactories(movingEntities.getFactory("position"), movingEntities.getFactory("velocity"));
                ms.process();

                for (let i = 0; i < positionFactory.nbCreated; ++i) {
                    expect(positionFactory.values[i].position.x).to.equal(2.0);
                }
                for (let i = movingEntities.nbCreated; i < movingEntities.size; ++i) {
                    expect(positionFactory.values[i].position.x).to.equal(0.0);
                }
            });
        });
    });

    describe("changing poolFactories of system at runtime without having to rewrite the system", () => {

        // Regroup proprieties in only one component
        class MovingComponent implements IPositionComponent, IVelocityComponent {
            constructor(public entityId: number, public active: boolean, public position: Ivec3, public velocity: Ivec3) { }
        }

        class MoveSystem extends System {
            constructor() { super(); }
            // overwrite setFactories is not necessary
            // unless you want to make sure the number of factories correspond to the number of parameters.
            public setFactories(f1: IComponentFactory<IComponent>, f2: IComponentFactory<IComponent>) {
                super.setFactories(f1, f2);
            }
            public execute(posC: IPositionComponent, veloC: IVelocityComponent) {
                posC.position.x *= veloC.velocity.x;
                posC.position.y *= veloC.velocity.y;
                posC.position.z *= veloC.velocity.z;
            }
        }

        let velocityFactory: ComponentFactory<VelocityComponent>;
        let movingFactory: ComponentFactory<MovingComponent>;

        beforeEach(() => {

            positionFactory = new ComponentFactory<PositionComponent>(5, PositionComponent, zeroVec3);
            velocityFactory = new ComponentFactory<VelocityComponent>(5, VelocityComponent, zeroVec3);
            movingFactory = new ComponentFactory<MovingComponent>(5, MovingComponent, zeroVec3, zeroVec3);

            for (let i = 1; i < positionFactory.size + 1; ++i) {
                positionFactory.create(i, true);
                const p = positionFactory.get(i);
                p.position.x = 1.0;
                p.position.y = 1.0;
                p.position.z = 1.0;
            }

            for (let i = 1; i < velocityFactory.size + 1; ++i) {
                velocityFactory.create(i, true);
                const v = velocityFactory.get(i);
                v.velocity.x = 2.0;
                v.velocity.y = 0.0;
                v.velocity.z = 0.0;
            }

            for (let i = 1; i < movingFactory.size + 1; ++i) {
                movingFactory.create(i, true);
                const m = movingFactory.get(i);
                m.position.x = 1.0;
                m.position.y = 1.0;
                m.position.z = 1.0;

                m.velocity.x = 2.0;
                m.velocity.y = 0.0;
                m.velocity.z = 0.0;
            }
        });
        it("should be able to get all param from one components", () => {
            const s = new MoveSystem();
            s.setFactories(movingFactory, movingFactory);
            s.process();

            for (let i = 0; i < movingFactory.size - 1; ++i) {
                expect(movingFactory.values[i].position.x).to.equal(2.0);
            }
        });
        it("should be able to get all params from multiples components", () => {
            const s = new MoveSystem();
            s.setFactories(positionFactory, velocityFactory);
            s.process();

            for (let i = 0; i < positionFactory.size - 1; ++i) {
                expect(positionFactory.values[i].position.x).to.equal(2.0);
            }
        });

    });
});
