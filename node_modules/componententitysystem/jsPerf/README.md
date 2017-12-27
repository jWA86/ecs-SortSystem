https://jsperf.com/iteration-of-only-actives-elements

Comparaison of data structure and processing for a pooling system where elements need to be activated and desactivated before processing.

- solution 1 : elements are moved between activated and desactivated array.
processing on activated array.
- solution 2 : elements are mixed in one array and their states are checked while processing.
- solution 3 : activated and desactivated elements are in one array but it's sorted, processing loop break when it encounters a desactivated element.
- solution 4 : activated and desactivated elements are moved between ES6 Map (hashMap), activated map is processed.
- solution 5 : use a custom data structure which combine hashMap for searching by id, and an array for iteration. : FastIterationMap

test include : 
 - iterate over the actives elements
 - desactivate half the numbers of actives elements (by index)
 - activate back those elements




https://jsperf.com/find-by-id-fastiterationmap

Search by id
- array.find();
- map.get(id);
- fasteIterationMap.get(id);


https://jsperf.com/continous-vs-spare-allocated-array

Comparaison of array that were allocated differently.
Difference is important on very large number of elements (64k+)