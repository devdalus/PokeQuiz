main();
var fCat = getElem("filter-category");
var fTyping = getElem("filter-typing");
var fType1 = getElem("filter-type1");
var fType2 = getElem("filter-type2");
var fGen = getElem("filter-gen");
var fEvo = getElem("filter-evo");
var fEvoMeth = getElem("filter-evo-method");

function createListeners() {
    getElem("success-button").onclick = function() {
        createPartiallyHiddenCard(selectCard());
    }
    
    getElem("fail-button").onclick = function() {
        createPartiallyHiddenCard(selectCard());
    }
    
    getElem("back-button").onclick = function() {
        if(cardHistory.length === 0) {
            return;
        }
        c = cardHistory.pop();
        createPartiallyHiddenCard(c);
    }

    fCat.onchange = function() {
        filter.category = filterData.categories[fCat.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fTyping.onchange = function() {
        filter.typing = filterData.typing[fTyping.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fType1.onchange = function() {
        filter.primaryType = filterData.types[fType1.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fType2.onchange = function() {
        filter.secondaryType = filterData.types[fType2.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fGen.onchange = function() {
        filter.gen = filterData.gens[fGen.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fEvo.onchange = function() {
        filter.evo = filterData.evo[fEvo.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
    fEvoMeth.onchange = function() {
        filter.evoMethod = filterData.evoMethods[fEvoMeth.value];
        populatePossibleCards();
        createPartiallyHiddenCard(selectCard());
    }
}
        
function createFilters() {
    for(var key in filterData.categories) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.categories[key]});
        fCat.appendChild(opt);
    }
    for(var key in filterData.typing) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.typing[key]});
        fTyping.appendChild(opt);
    }
    for(var key in filterData.types) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.types[key]});
        fType1.appendChild(opt);
    }
    for(var key in filterData.types) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.types[key]});
        fType2.appendChild(opt);
    }
    for(var key in filterData.gens) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.gens[key]});
        fGen.appendChild(opt);
    }
    for(var key in filterData.evo) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.evo[key]});
        fEvo.appendChild(opt);
    }
    for(var key in filterData.evoMethods) {
        var opt = createElement("option", {value: key}, {innerHTML: filterData.evoMethods[key]});
        fEvoMeth.appendChild(opt);
    }
}

createListeners();
createFilters();