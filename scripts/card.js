async function card(id,hide_options = {name: false, image: false, types: false, id: false, extra: false, gen: false, weight: false, height: false, abilities: false, forms: false, evo: false}) {

    if(Object.keys(data).length === 0) {
        data = await loadJSONfile("./data/data.json");
    }

    var mon = data[id];
    var parentMon;
    var parentMonID;

    var isForm = false;

    if(parseInt(id) >= 10000) {
        isForm = true;
        var keys = Object.keys(data)
        for(var i = 0; i < keys.length; i++) {
            var forms = data[keys[i]].forms;
            for(var j = 0; j < forms.length; j++) {
                if(forms[j].id == id) {
                    parentMon = data[keys[i]];
                    parentMonID = keys[i];
                    mon = forms[j];
                    break;
                }
            }
        }
    }

    // name
    getElem("card-name").innerHTML = "Name: " + (hide_options.name ? `<div class="card-hidden">${mon.name}</div>` : mon.name);

    // change image src
    getElem("card-image").src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png";
    if(hide_options.image) {
        getElem("card-image").classList.add("card-hidden");
    } else {
        getElem("card-image").classList.remove("card-hidden");
    }

    // types
    var type = getElem("card-types");
    type.innerHTML = "<p>Type(s):</p>";

    var typeContainer = createElement("div", {
        "class": "card-type-container" + (hide_options.types ? " card-hidden" : "")
    });

    typeContainer.appendChild(createElement("div", {
        "class": "card-type card-type-" + mon.primary_type
    }, {
        "innerHTML": mon.primary_type
    }));

    if(mon.secondary_type !== "") {
        typeContainer.appendChild(createElement("div", {
            "class": "card-type card-type-" + mon.secondary_type
        }, {
            "innerHTML": mon.secondary_type
        }));
    }

    type.appendChild(typeContainer);

    // id
    if(isForm) {
        getElem("card-id").innerHTML = "ID: " + (hide_options.id ? `<div class="card-hidden">#${parentMonID}</div>` : parentMonID);
    } else {
        getElem("card-id").innerHTML = "ID: " + (hide_options.id ? `<div class="card-hidden">#${id}</div>` : id);
    }

    // extra attributes
    var extra = getElem("card-attribute-extra");
    extra.innerHTML = "";
    if(mon.baby) {
        extra.appendChild(createElement("div", {
            "class": "card-attribute card-attribute-baby" + (hide_options.extra ? " card-hidden" : "")
        }, {
            "innerHTML": "Baby"
        }));
    } else if(mon.legendary) {
        extra.appendChild(createElement("div", {
            "class": "card-attribute card-attribute-legendary" + (hide_options.extra ? " card-hidden" : "")
        }, {
            "innerHTML": "Legendary"
        }));
    } else if(mon.mythical) {
        extra.appendChild(createElement("div", {
            "class": "card-attribute card-attribute-mythical" + (hide_options.extra ? " card-hidden" : "")
        }, {
            "innerHTML": "Mythical"
        }));
    } else {
        extra.appendChild(createElement("div", {
            "class": "card-attribute card-attribute-normal" + (hide_options.extra ? " card-hidden" : "")
        }, {
            "innerHTML": "Normal"
        }));
    }

    
    // generation
    if(isForm) {
        getElem("card-attribute-generation").innerHTML = (hide_options.gen ? `<div class="card-hidden">${parentMon.gen}</div>` : parentMon.gen);
    } else {
        getElem("card-attribute-generation").innerHTML = (hide_options.gen ? `<div class="card-hidden">${mon.gen}</div>` : mon.gen);
    }

    

    // weight
    getElem("card-attribute-weight").innerHTML = (hide_options.weight ? `<div class="card-hidden">${(mon.weight/10).toFixed(1)} kg</div>` : (mon.weight/10).toFixed(1) + " kg");

    // height
    getElem("card-attribute-height").innerHTML = (hide_options.height ? `<div class="card-hidden">${(mon.height/10).toFixed(1)} m</div>` : (mon.height/10).toFixed(1) + " m");

    // abilities
    var abilitiesDiv = getElem("card-attribute-abilities");
    abilitiesDiv.innerHTML = "";

    var abilitiesContainer = createElement("div", {
        "class": "card-ability-container" + (hide_options.abilities ? " card-hidden" : "")
    });

    mon.abilities.forEach((e) => {
        if(e.is_hidden) {
            abilitiesContainer.innerHTML += "<span class=\"card-ability-hidden\">" + e.name + "</div>, ";
        } else {
            abilitiesContainer.innerHTML += "<span class=\"card-ability\">" + e.name + "</div>, ";
        }
    });

    abilitiesContainer.innerHTML = abilitiesContainer.innerHTML.slice(0, -2);

    abilitiesDiv.appendChild(abilitiesContainer);

    // forms
    var forms = getElem("card-forms");
    forms.innerHTML = "";

    
    forms.appendChild(createElement("p", {
        "innerHTML": "Forms:"
    }));

    var formContainer = createElement("div", {
        "class": "card-form-container" + (hide_options.forms ? " card-hidden" : "")
    });


    if(mon.forms.length !== 0 && !isForm) {
        mon.forms.forEach((e) => {
            var form = createElement("div", {
                "class": "card-form"
            });

            form.innerHTML += "<br><a href=\"./card.html?id=" + e.id + "\">" + e.name + "</a><br>";
            form.appendChild(createElement("img", {
                "src": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + e.id + ".png"
            }));

            form.innerHTML += "<br>";

            form.appendChild(createElement("div", {
                "class": "card-type card-type-" + e.primary_type
            }, {
                "innerHTML": e.primary_type
            }));
        
            if(e.secondary_type !== "") {
                form.appendChild(createElement("div", {
                    "class": "card-type card-type-" + e.secondary_type
                }, {
                    "innerHTML": e.secondary_type
                }));
            }
        
            formContainer.appendChild(form);
        });
    }

    forms.appendChild(formContainer);
    

    // evolution
    var from = getElem("card-evo-from");
    from.innerHTML = "";
    var to = getElem("card-evo-to");
    to.innerHTML = "";

    if(hide_options.evo) {
        from.classList.add("card-hidden");
        to.classList.add("card-hidden");
    } else {
        from.classList.remove("card-hidden");
        to.classList.remove("card-hidden");
    }

    if(mon.evo_from !== 0 && !isForm) {
        from.innerHTML = "<p><a href=\"./card.html?id=" + mon.evo_from + "\">" + data[mon.evo_from].name + "</a> by " + mon.evo_method + " </p>";
        from.appendChild(createElement("img", {
            "src": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + mon.evo_from + ".png"
        }));
    } else {
        from.innerHTML = "<p>none</p>";
    }

    if(mon.evo_to.length !== 0 && !isForm) {

        mon.evo_to.forEach((e) => {
            to.innerHTML += "<a href=\"./card.html?id=" + e + "\">" + data[e].name + "</a> by " + data[e].evo_method + "<br>";
            to.appendChild(createElement("img", {
                "src": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + e + ".png"
            }));
        });
    } else {
        to.innerHTML = "<p>none</p>";
    }


    function removeHidden(e) {
        var target = e.target;

        while(!target.classList.contains("card-hidden")) {
            target = target.parentElement;
        }

        target.classList.remove("card-hidden");
        target.removeEventListener("click", removeHidden);
        target.removeEventListener("touchstart", removeHidden);
    }

    elementsWithTagMap("div", (e) => {
        if(e.classList.contains("card-hidden")) {
            e.addEventListener("click", removeHidden);
            e.addEventListener("touchstart", removeHidden);
        }
    });

    if(getElem("card-image").classList.contains("card-hidden")) {
        getElem("card-image").addEventListener("click", removeHidden);
        getElem("card-image").addEventListener("touchstart", removeHidden);
    }

    getElem("reveal-button").onclick = function() {
        elementsWithTagMap("div", (e) => {
            if(e.classList.contains("card-hidden")) {
                e.classList.remove("card-hidden");
            }
        });

        if(getElem("card-image").classList.contains("card-hidden")) {
            getElem("card-image").classList.remove("card-hidden");
        }
    }

}