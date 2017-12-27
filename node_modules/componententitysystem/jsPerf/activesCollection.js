var onlyActives = [];
var mix = [];
var sortedActives = [];
var onlyActivesMap = new Map();
var fastIteMap = new FastIterationMap();

var l = 10000;

for(var i = 0; i < l; ++i) {
	var o = {'id':i, 'it':0, 'actif': true};
	onlyActives.push(o);
	mix.push(o);
	sortedActives.push(o);
	onlyActivesMap.set(i, o);
    fastIteMap.set(i, o);
}

for(var i = l; i < l*2; ++i){
	var o = {'id':i, 'it':0, 'actif':false}
	mix.push(o);
	sortedActives.push(o);
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

shuffle(mix);
shuffle(onlyActives);
shuffle(sortedActives);

function sortA(e1, e2) {
    if(e1.actif && !e2.actif) return -1;
    if(!e1.actif && e2.actif) return 1;
    return 0;
}

sortedActives.sort(sortA);


var toDeleteId = [];
for(var i = 0; i< l/2; ++i){
    toDeleteId.push(Math.ceil(Math.random()*l-1));
}



// only active array


for(var i = 0; i < l;++i) {
	onlyActives[i].it += Math.random()*10;
}
// desactivate
var ref = [];
for(var i = 0; i < toDeleteId.length; ++i) {
	ref.push(onlyActives.splice(i, 1));
}

// activate
for(var i =0;i<ref.length;++i){
	onlyActives.push(ref[i]);
}

// iteration again
for(var i = 0; i < l;++i) {
	onlyActives[i].it += Math.random()*10;
}


// array with branching processing



var le = l*2;
for(var i = 0; i < le;++i) {
	if(mix[i].actif) {
		mix[i].it += Math.random()*10;
	}
}

// desactivate
for(var i = 0; i < toDeleteId.length; ++i) {
	mix[i].actif = false;
}

//activate
for(var i = 0; i < toDeleteId.length; ++i) {
	mix[i].actif = true;
}

// iteration again
for(var i = 0; i < le;++i) {
	if(mix[i].actif) {
		mix[i].it += Math.random()*10;
	}
}





// sorted array

var le = l*2;
for(var i = 0; i < le;++i) {
	if(!sortedActives[i].actif){break;}
	sortedActives[i].it += Math.random()*10;
}

// desactivate
for(var i = 0; i < toDeleteId.length; ++i){
	sortedActives[i].actif = false;
}
sortedActives.sort(sortA);

// activate
for(var i = 0; i < toDeleteId.length; ++i){
	sortedActives[i].actif = true;
}
sortedActives.sort(sortA);

// iteration again
for(var i = 0; i < le;++i) {
	if(!sortedActives[i].actif){break;}
	sortedActives[i].it += Math.random()*10;
}


// ES6 MAP

onlyActivesMap.forEach(function(e){
	e.it += Math.random()*10;
});

//desactivate
var ref = new Map();
for(var i = 0; i < toDeleteId.length; ++i) {
	// ref.set(i, onlyActivesMap.get(i)); 
  // in our pooling system we desactivate elements while processing, so we already have the reference to the element, don't need to get it again.
// for the test we add a dummy element.
  ref.set(i, {'id':i, 'it':0, 'actif':false});
	onlyActivesMap.delete(i);
}

// activate
ref.forEach(function(e){
	onlyActivesMap.set(e.id, e);
});

// iteration again
onlyActivesMap.forEach(function(e){
	e.it += Math.random()*10;
});



// fast iteration map with branching processing


var activesEle = fastIteMap.values;
var le = l*2;
for(var i = 0; i < le; ++i){
    if(activesEle[i].actif){
        activesEle[i].it += Math.random()*10;
    }
}

//desactivate
var ref = [];
for(var i = 0; i < toDeleteId.length; ++i) {
    activesEle[toDeleteId[i]].actif = false;
}

// activate
for(var i = 0; i < toDeleteId.length; ++i){
	activesEle[toDeleteId[i]].actif = true;
}

// iterate again
for(var i = 0; i < le; ++i){
    if(activesEle[i].actif){
        activesEle[i].it += Math.random()*10;
    }
}