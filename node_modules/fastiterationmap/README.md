# fastIterationMap
A typescript implementation of a ES6 Map with Array like performance for iteration and O(1) for lookup but O(2n for deletion).

It uses an ES6 Map for storing keys and corresponding index of elements the array that is use for iteration.


```shell
    npm install fastiterationmap --save
```

use src/FastIterationMap.ts for typescript 
or dist/fastIterationMap.min.js for browser distribution



```javascript
interface IFastIterationMap<K, V> {
    clear();
    delete(key: K): boolean;
    get(key: K): V
    has(key: K): boolean;
    insertAfter(key: K, value: V, keyRef: K): boolean;
    insertBefore(key: K, value: V, keyRef: K): boolean;
    keys: Map<K, number>
    length: number;
    push(key: K, value: V);
    set(key: K, value: V);
    size: number;
    values: V[];
}
```

```javascript
interface ISimpleObject {
    prop1:string;
    prop2:number;
}
let myFMap = new FastIterationMap<string, ISimpleObject>();

myFMap.set('c1', {'prop1':"abc", 'prop2':0});
// same as 
myFMap.push('c2', {'prop1':"abc", 'prop2':2});
//myFMap.length == 2

// updating an element by setting with an existing key
myFMap.set('c1', {'prop1':"abc", 'prop2':1});
//myFMap.length == 2

// inserting element before another one 
myFMap.insertBefore('c3', {'prop1':"abc", 'prop2':3}, 'c2');
// inserting element after another one 
myFMap.insertAfter('c4', {'prop1':"abc", 'prop2':4}, 'c3');

// iterate values
// for loop is faster than forEach
let size = myFMap.length;
for(let i = 0; i < size; ++i){
    console.log(myFMap.values[i].prop2);    
}
// output : 
// 1
// 3
// 4
// 2

// element lookup by key
let o1 = myFMap.get('c1'); 
//o1 = {'prop1':"abc", 'prop2':1}

//does the collection hold an element with a given key ?
myFMap.has('c1'); // return true

// removing an element
myFMap.delete('c1');
myFMap.has('c1'); // return false;

//removing everything
myFMap.clear();
// myFMap.length === 0
```