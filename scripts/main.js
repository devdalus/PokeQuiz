var data = {};
var possibleCards = [];
var cardHistory = [];
var curCard = 0;

function elementsWithTagMap(tag, f, parent = document) {
    [].forEach.call(parent.getElementsByTagName(tag), (e) => f(e));
}

function createElement(tag,attributes, dotAttributes = {}) {
    var element = document.createElement(tag);
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    for (var key in dotAttributes) {
        element[key] = dotAttributes[key];
    }
    return element;
}

function getElem(id) {
    return document.getElementById(id);
}

function insertAfter(node, child) {
    if(node.nextElementSibling === null) {
        node.parentElement.appendChild(child);
    } else {
        node.parentElement.insertBefore(child, node.nextElementSibling);
    }
}

function populatePossibleCards() {
    Object.keys(data).forEach((e) => {
        possibleCards.push(e);
    });
}

function selectCard() {
    if(possibleCards.length === 0) {
        populatePossibleCards();
    }
    var c = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    possibleCards.splice(possibleCards.indexOf(c), 1);
    cardHistory.push(curCard);
    curCard = c;
    return c;
}

function createPartiallyHiddenCard(mon) {
    var hide_options = {name: getElem("name").checked, image: getElem("image").checked, types: getElem("types").checked, id: getElem("id").checked, extra: getElem("extra").checked, gen: getElem("generation").checked, weight: getElem("weight").checked, height: getElem("height").checked, abilities: getElem("abilities").checked, forms: getElem("forms").checked, evo: getElem("evolutions").checked};
    card(mon, hide_options);
}

async function main() {
    data = await loadJSONfile("./data/data.json");

    createPartiallyHiddenCard(selectCard());
}