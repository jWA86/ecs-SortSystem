var arr = [];
var map = new Map();
var fastIteMap = new Map();

var l = 10000;

for (var i = 0; i < l; ++i) {
    var o = { 'id': i, 'it': 0, 'actif': true };
    arr.push(o);
    map.set(i, o);
    fastIteMap.set(i, o);
}
// add the same number but inactive
for (var i = l; i < l * 2; ++i) {
    var o = { 'id': i, 'it': 0, 'actif': false }
    arr.push(o);
    map.set(i, o);
    fastIteMap.set(i, o);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

shuffle(arr);

var toSearchId = [];
for (var i = 0; i < l / 2; ++i) {
    toSearchId.push(Math.ceil(Math.random() * l - 1));
}



// array 
for (var i = 0; i < toSearchId.length; ++i) {
    arr.find(function (e) {
        return e.id === toSearchId[i];
    }).it += Math.random() * 10;
}

// map

for (var i = 0; i < toSearchId.length; ++i) {
    map.get(toSearchId[i]).it += Math.random() * 10;
};

// fastiterationMap
for (var i = 0; i < toSearchId.length; ++i) {
    fastIteMap.get(toSearchId[i]).it += Math.random() * 10;
};