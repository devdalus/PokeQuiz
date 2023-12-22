var data = {};

const filterData = {
    categories: { all: "All", baby: "Baby", legendary: "Legendary", mythical: "Mythical", mega: "Mega", gMax: "GMax" },
    types: { normal: "Normal", fire: "Fire", water: "Water", electric: "Electric", grass: "Grass", ice: "Ice", fighting: "Fighting", poison: "Poison", ground: "Ground", flying: "Flying", psychic: "Psychic", bug: "Bug", rock: "Rock", ghost: "Ghost", dragon: "Dragon", dark: "Dark", steel: "Steel", fairy: "Fairy" },
    typing: { all: "All", mono: "Mono Type: 1", p1sAny: "Primary: 1, Secondary: Any", p1s2: "Primary: 1, Secondary: 2", oneOrTwo: "Ignore order, type 1 and type 2" },
    gens: { all: "All", gen1: "Gen 1", gen2: "Gen 2", gen3: "Gen 3", gen4: "Gen 4", gen5: "Gen 5", gen6: "Gen 6", gen7: "Gen 7", gen8: "Gen 8", gen9: "Gen 9" },
    evo: { all: "All", noEvo: "No Evo", first: "First", middle: "Middle", final: "Final" },
    evoMethods: { all: "All", level: "Level", trade: "Trade", item: "Item", other: "Other" }
};

var filter = { category: filterData.categories.all, typing: filterData.typing.all, primaryType: filterData.types.normal, secondaryType: filterData.types.normal, gen: filterData.gens.all, evo: filterData.evo.all, evoMethod: filterData.evoMethods.all };
var possibleCards = [];
var cardHistory = [];
var curCard = 0;

function elementsWithTagMap(tag, f, parent = document) {
    [].forEach.call(parent.getElementsByTagName(tag), (e) => f(e));
}

function createElement(tag, attributes, dotAttributes = {}) {
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
    if (node.nextElementSibling === null) {
        node.parentElement.appendChild(child);
    } else {
        node.parentElement.insertBefore(child, node.nextElementSibling);
    }
}

function populatePossibleCards() {
    Object.keys(data).forEach((e) => {
        possibleCards.push(e);
    });

    switch (filter.category) {
        case filterData.categories.baby:
            possibleCards = possibleCards.filter((e) => data[e].baby);
            break;
        case filterData.categories.legendary:
            possibleCards = possibleCards.filter((e) => data[e].legendary);
            break;
        case filterData.categories.mythical:
            possibleCards = possibleCards.filter((e) => data[e].mythical);
            break;
        case filterData.categories.mega:
            possibleCards = possibleCards.filter((e) => {
                for (var a of data[e].forms) {
                    if (a.name.includes("mega")) {
                        return true;
                    }
                }
                return false;
            });
            break;
        case filterData.categories.gMax:
            possibleCards = possibleCards.filter((e) => {
                for (var a of data[e].forms) {
                    if (a.name.includes("gmax")) {
                        return true;
                    }
                }
                return false;
            });
            break;
    }

    var p = filter.primaryType.toLowerCase();
    var s = filter.secondaryType.toLowerCase();
    switch (filter.typing) {
        case filterData.typing.mono:
            possibleCards = possibleCards.filter((e) => data[e].primary_type === p && data[e].secondary_type === "");
            break;
        case filterData.typing.p1sAny:
            possibleCards = possibleCards.filter((e) => data[e].primary_type === p);
            break;
        case filterData.typing.p1s2:
            possibleCards = possibleCards.filter((e) => data[e].primary_type === p && data[e].secondary_type === s);
            break;
        case filterData.typing.oneOrTwo:
            possibleCards = possibleCards.filter((e) => (data[e].primary_type === p && data[e].secondary_type === s) || (data[e].primary_type === s && data[e].secondary_type === p));
            break;
    }

    if(filter.gen !== filterData.gens.all) {
        possibleCards = possibleCards.filter((e) => data[e].gen === parseInt(filter.gen.split(" ")[1]));
    }

    switch (filter.evo) {
        case filterData.evo.noEvo:
            possibleCards = possibleCards.filter((e) => data[e].evo_from === 0 && data[e].evo_to.length === 0);
            break;
        case filterData.evo.first:
            possibleCards = possibleCards.filter((e) => data[e].evo_from === 0 && data[e].evo_to.length !== 0);
            break;
        case filterData.evo.middle:
            possibleCards = possibleCards.filter((e) => data[e].evo_from !== 0 && data[e].evo_to.length !== 0);
            break;
        case filterData.evo.final:
            possibleCards = possibleCards.filter((e) => data[e].evo_from !== 0 && data[e].evo_to.length === 0);
            break;
    }

    switch (filter.evoMethod) {
        case filterData.evoMethods.level:
            possibleCards = possibleCards.filter((e) => data[e].evo_method.includes("level-up")); 
            break;
        case filterData.evoMethods.trade:
            possibleCards = possibleCards.filter((e) => data[e].evo_method.includes("trade"));
            break;
        case filterData.evoMethods.item:
            possibleCards = possibleCards.filter((e) => data[e].evo_method.includes("use-item"));
            break;
        case filterData.evoMethods.other:
            possibleCards = possibleCards.filter((e) => data[e].evo_method !== "" && !data[e].evo_method.includes("level-up") && !data[e].evo_method.includes("trade") && !data[e].evo_method.includes("use-item"));
            break;
    }

    if (possibleCards.length === 0) {
        possibleCards = ['1'];
        getElem("filter-warning").classList.remove("hidden");
    } else {
        getElem("filter-warning").classList.add("hidden");
    }
}

function selectCard() {
    if (possibleCards.length === 0) {
        populatePossibleCards();
    }
    var c = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    possibleCards.splice(possibleCards.indexOf(c), 1);
    cardHistory.push(curCard);
    curCard = c;
    return c;
}

function createPartiallyHiddenCard(mon) {
    var hide_options = { name: getElem("name").checked, image: getElem("image").checked, types: getElem("types").checked, id: getElem("id").checked, extra: getElem("extra").checked, gen: getElem("generation").checked, weight: getElem("weight").checked, height: getElem("height").checked, abilities: getElem("abilities").checked, forms: getElem("forms").checked, evo: getElem("evolutions").checked };
    card(mon, hide_options);
}

async function main() {
    data = await loadJSONfile("./data/data.json");

    createPartiallyHiddenCard(selectCard());
}
