import { expect } from "chai";
import "mocha";
import { FastIterationMap } from "../src/FastIterationMap";

describe("Custom HashMap", () => {
    let k;
    let k2;
    let k3;
    let  v;
    let  v2;
    let v3;
    class Ob {
        public prop1: number;
        public prop2: string;
    }
    let myMap = new FastIterationMap<string, Ob>();
    beforeEach(() => {
        k = "myKey1";
        v = { prop1: 1, prop2: "aString" };
        k2 = "myKey2";
        v2 = { prop1: 2, prop2: "aString" };
        k3 = "myKey3";
        v3 = { prop1: 3, prop2: "aString" };
        myMap = new FastIterationMap<string, Ob>();
    });
    describe("collections", () => {
        it("keys() should return an object Map", () => {
            expect(myMap.keys instanceof Map).to.equal(true);
        });
        it("this should return an array", () => {
            expect(myMap.values instanceof Array).to.equal(true);
        });
    });
    describe("set(key, value)", () => {
        it("should be able to add an element to the values array", () => {
            // set
            myMap.set(k, v);
            expect(myMap.values[0]).to.equal(v);
        });
        it("should be able to add the key and the corresponding index in the keys Map", () => {
            myMap.set(k, v);
            const m = [];
            myMap.keys.forEach((val, key) => {
                m.push(val);
                m.push(key);
            });
            // value in the keys is the index of element in the values array
            expect(m[0]).to.equal(0);
            expect(m[1]).to.equal(k);
        });
        it("set with a prexisting key should update the element instead of adding one", () => {
            myMap.set(k, v);
            expect(myMap.length).to.equal(1);
            expect(myMap.keys.size).to.equal(1);
            expect(myMap.get(k)).to.equal(v);
            myMap.set(k, v2);
            expect(myMap.length).to.equal(1);
            expect(myMap.keys.size).to.equal(1);
            expect(myMap.get(k)).to.equal(v2);
        });
    });
    describe("push(key, value) same behavior as set(k,v)", () => {
        // it('push should not add any element if a key is missing', () => {
        //     myMap.push(v);
        //     expect(myMap.values[0]).to.equal(undefined);
        // });
        it("should be able to add an element to the values array", () => {
            myMap.push(k2, v2);
            expect(myMap.values[0]).to.equal(v2);
        });
        it("should be able to add the key and the corresponding index in the keys Map", () => {
            myMap.push(k, v);
            const m = [];
            myMap.keys.forEach((value, key) => {
                m.push(value);
                m.push(key);
            });
            // value in the keys is the index of element in the values array
            expect(m[0]).to.equal(0);
            expect(m[1]).to.equal(k);
        });
        it("length should return the number of element in the hashMap", () => {
            expect(myMap.length).to.equal(0);
            myMap.set(k, v);
            expect(myMap.length).to.equal(1);
        });
        it("push with a prexisting key should update the element instead of adding one", () => {
            myMap.push(k, v);
            expect(myMap.length).to.equal(1);
            expect(myMap.keys.size).to.equal(1);
            expect(myMap.get(k)).to.equal(v);
            myMap.push(k, v2);
            expect(myMap.length).to.equal(1);
            expect(myMap.keys.size).to.equal(1);
            expect(myMap.get(k)).to.equal(v2);
        });
    });
    describe("get(key)", () => {
        it("should be able to return the element with the corresponding key", () => {
            myMap.set(k, v);
            expect(myMap.get(k)).to.equal(v);
        });
        it("should return undefined if not found", () => {
            expect(myMap.get("keyNotP")).to.equal(undefined);
        });
    });
    describe("delete(key)", () => {
        it("should return true if it deleted the element ", () => {
            myMap.set(k, v);
            const r = myMap.delete(k);
            expect(r).to.equal(true);
        });
        it("should return false if it didn't delete the element ", () => {
            const r = myMap.delete("keyNotPresentInCollection");
            expect(r).to.equal(false);
        });
        it("should delete the element from the keys Map", () => {
            myMap.set(k, v);
            myMap.delete(k);
            expect(myMap.keys.size).to.equal(0);
        });
        it("should delete the element from the values array", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            expect(myMap.length).to.equal(2);
            myMap.delete(k);
            expect(myMap.length).to.equal(1);
        });
        it("should offset index of all the other elements in the keys Map", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.set(k3, v3);
            // index of k2 is 1
            expect(myMap.keys.get(k2)).to.equal(1);
            myMap.delete(k);
            // index of k2 and k3 should be decrement after deletion of the previous element
            expect(myMap.keys.get(k2)).to.equal(0);
            expect(myMap.keys.get(k3)).to.equal(1);
        });
    });
    describe("clear()", () => {
        it("should remove all keys and values", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.clear();
            expect(myMap.keys.size).to.equal(0);
            expect(myMap.length).to.equal(0);
        });
    });
    describe("has()", () => {
        it("should able to return true when element is found", () => {
            myMap.set(k, v);
            expect(myMap.has(k)).to.equal(true);
        });
        it("should able to return false when element is not found", () => {
            expect(myMap.has("rKey")).to.equal(false);
        });
    });
    describe("insertAfter() ", () => {
        it("should insert the element in the values array after the element of reference", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            // insert k3 after k so it should be between k and k2
            myMap.insertAfter(k3, v3, k);
            expect(myMap.values[1].prop1).to.equal(3);
        });
        it("should offset all other elements in the values array", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            expect(myMap.values[1].prop1).to.equal(2);
            myMap.insertAfter(k3, v3, k);
            // k2 should be offset by 1
            expect(myMap.values[2].prop1).to.equal(2);
        });
        it("should insert the key in the keys Map and update all index of the elements positioned after ", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertAfter(k3, v3, k);
            // k=0 k2=1 --> k=0 k3=1 k2=2
            expect(myMap.keys.get(k3)).to.equal(1);
            expect(myMap.keys.get(k2)).to.equal(2);
            expect(myMap.keys.get(k)).to.equal(0);
        });
        it("should return true if it succeeds to insert element", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertAfter(k3, v3, k);
            expect(r).to.equal(true);
        });
        it("should return false if it fails to insert element", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertAfter(k3, v3, "notPresentedKey");
            expect(r).to.equal(false);
        });
        it("get() should return the element after it has been inserted after another one", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertAfter(k3, v3, k);
            expect(myMap.get(k3)).to.equal(v3);
            expect(myMap.get(k2)).to.equal(v2);
            expect(myMap.get(k)).to.equal(v);
        });
        it("get() should return the element after it has been inserted after the last one", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertAfter(k3, v3, k2);
            expect(myMap.get(k3)).to.equal(v3);
            expect(myMap.get(k2)).to.equal(v2);
            expect(myMap.get(k)).to.equal(v);
        });
        it("insertAfter with the same key should return false", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertAfter(k, v3, k);
            expect(r).to.equal(false);
            expect(myMap.get(k)).to.equal(v);
            expect(myMap.size).to.equal(2);
        });
    });
    describe("insertBefore() ", () => {
        it("should insert the element in the values array before the element of reference", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            // insert k3 before k2 so it should be between k and k2
            myMap.insertBefore(k3, v3, k2);
            expect(myMap.values[1].prop1).to.equal(3);
        });
        it("should offset all other elements in the values array", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            expect(myMap.values[1].prop1).to.equal(2);
            myMap.insertBefore(k3, v3, k2);
            // k2 should be offset by 1
            expect(myMap.values[2].prop1).to.equal(2);
        });
        it("should insert the key in the keys Map and update all index of the elements positioned before", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertBefore(k3, v3, k2);
            // k=0 k2=1 --> k=0 k3=1 k2=2
            expect(myMap.keys.get(k3)).to.equal(1);
            expect(myMap.keys.get(k2)).to.equal(2);
            expect(myMap.keys.get(k)).to.equal(0);
        });
        it("should return true if it succeeds to insert element", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertBefore(k3, v3, k2);
            expect(r).to.equal(true);
        });
        it("should return false if it fails to insert element", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertBefore(k3, v3, "notPresentedKey");
            expect(r).to.equal(false);
        });
        it("get() should return the element after it has been inserted before another one", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertBefore(k3, v3, k2);
            expect(myMap.get(k3)).to.equal(v3);
            expect(myMap.get(k2)).to.equal(v2);
            expect(myMap.get(k)).to.equal(v);
        });
        it("get() should return the element after it has been inserted before another the first element", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            myMap.insertBefore(k3, v3, k);
            expect(myMap.get(k3)).to.equal(v3);
            expect(myMap.get(k2)).to.equal(v2);
            expect(myMap.get(k)).to.equal(v);
        });
        it("insertBefore with the same key should return false", () => {
            myMap.set(k, v);
            myMap.set(k2, v2);
            const r = myMap.insertAfter(k, v3, k);
            expect(r).to.equal(false);
            expect(myMap.get(k)).to.equal(v);
            expect(myMap.size).to.equal(2);
        });
    });
    describe("swap", () => {
        it("an item positon with an other one ", () => {
            myMap.push(k, v);
            myMap.push(k2, v2);
            myMap.push(k3, v3);
            expect(myMap.get(k).prop1).to.equal(1);
            expect(myMap.get(k2).prop1).to.equal(2);
            expect(myMap.get(k3).prop1).to.equal(3);
            // checking position
            myMap.swap(k, k3);
            expect(myMap.values[0].prop1).to.equal(3);
            expect(myMap.values[1].prop1).to.equal(2);
            expect(myMap.values[2].prop1).to.equal(1);

        });
        it("return true if swap is succefull", () => {
            myMap.push(k, v);
            myMap.push(k3, v3);
            expect(myMap.swap(k, k3)).to.equal(true);
        });
        it("return false if the key are not present in the collection", () => {
            myMap.push(k, v);
            expect(myMap.swap(k, k3)).to.equal(false);
            myMap.push(k3, v3);
            expect(myMap.swap(k2, k3)).to.equal(false);
        });
    });
});
