import csv
import os
import json

# load data from csv file
def load_data(filename):
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        data = list(reader)
    return data

def main():

    evo_triggers_unparsed = load_data('./pokeapi-master/data/v2/csv/evolution_triggers.csv')
    evo_triggers = { k:v for k,v in zip([i[0] for i in evo_triggers_unparsed[1:]], [i[1] for i in evo_triggers_unparsed[1:]]) }

    # height and weight are in decimeters and hectograms respectively
    # 0 id, 1 identifier, 2 species_id, 3 height, 4 weight, 5 base_experience, 6 order, 7 is_default
    data_pkm = load_data('./pokeapi-master/data/v2/csv/pokemon.csv')
    # 0 id, 1 identifier, 2 generation_id, 3 is_main_series
    data_ability_names_unparsed = load_data('./pokeapi-master/data/v2/csv/abilities.csv')
    data_ability_names = { k:v for k,v in zip([i[0] for i in data_ability_names_unparsed[1:]], [i[1] for i in data_ability_names_unparsed[1:]]) }

    # 0 id, 1 identifier, 2 category_id, 3 cost, 4 fling_power, 5 fling_effect_id
    data_items_unparsed = load_data('./pokeapi-master/data/v2/csv/items.csv')
    data_items = { k:v for k,v in zip([i[0] for i in data_items_unparsed[1:]], [i[1] for i in data_items_unparsed[1:]]) }

    # 0 id, 1 evolved_species_id, 2 evolution_trigger_id, 3 trigger_item_id, 4 minimum_level, 5 gender_id, 6 location_id, 7 held_item_id, 8 time_of_day, 9 known_move_id, 10 known_move_type_id, 11 minimum_happiness, 12 minimum_beauty, 13 minimum_affection, 14 relative_physical_stats, 15 party_species_id, 16 party_type_id, 17 trade_species_id, 18 needs_overworld_rain, 19 turn_upside_down
    data_pkm_evo_unparsed = load_data('./pokeapi-master/data/v2/csv/pokemon_evolution.csv')
    data_pkm_evo = {}
    for i in range(1, len(data_pkm_evo_unparsed)):
        data_pkm_evo[data_pkm_evo_unparsed[i][1]] = evo_triggers[data_pkm_evo_unparsed[i][2]] + (": " + data_items[data_pkm_evo_unparsed[i][3]] if evo_triggers[data_pkm_evo_unparsed[i][2]] == "use-item" else "")

    # 0 id, 1 identifier, 2 generation_id, 3 evolves_from_species_id, 4 evolution_chain_id, 5 color_id, 6 shape_id, 7 habitat_id, 8 gender_rate, 9 capture_rate, 10 base_happiness, 11 is_baby, 12 hatch_counter, 13 has_gender_differences, 14 growth_rate_id, 15 forms_switchable, 16 is_legendary, 17 is_mythical, 18 order, 19 conquest_order
    data_pkm_species_unparsed = load_data('./pokeapi-master/data/v2/csv/pokemon_species.csv')
    data_pkm_species = {}
    for i in range(1, len(data_pkm_species_unparsed)):
        data_pkm_species[data_pkm_species_unparsed[i][0]] = {"evolves_from": data_pkm_species_unparsed[i][3], "baby": data_pkm_species_unparsed[i][11], "legendary": data_pkm_species_unparsed[i][16], "mythical": data_pkm_species_unparsed[i][17], "gen": data_pkm_species_unparsed[i][2]}

    # 0 pokemon_id, 1 ability_id, 2 is_hidden, 3 slot
    data_pkm_abilities_unparsed = load_data('./pokeapi-master/data/v2/csv/pokemon_abilities.csv')
    data_pkm_abilities = {}
    for i in range(1, len(data_pkm_abilities_unparsed)):
        if(data_pkm_abilities_unparsed[i][0] not in data_pkm_abilities):
            data_pkm_abilities[data_pkm_abilities_unparsed[i][0]] = []

        data_pkm_abilities[data_pkm_abilities_unparsed[i][0]].append({"name": data_ability_names[data_pkm_abilities_unparsed[i][1]], "is_hidden": bool(int(data_pkm_abilities_unparsed[i][2]))})

    # 0 id, 1 identifier, 2 generation_id, 3 damage_class_id
    data_type_names_unparsed = load_data('./pokeapi-master/data/v2/csv/types.csv')
    data_type_names = { k:v for k,v in zip([i[0] for i in data_type_names_unparsed[1:]], [i[1] for i in data_type_names_unparsed[1:]]) }

    # 0 pokemon_id, 1 type_id, 2 slot
    data_pkm_types_unparsed = load_data('./pokeapi-master/data/v2/csv/pokemon_types.csv')
    data_pkm_types_primary = {}
    data_pkm_types_secondary = {}
    for i in range(1, len(data_pkm_types_unparsed)):
        if(data_pkm_types_unparsed[i][2] == '1'):
            data_pkm_types_primary[data_pkm_types_unparsed[i][0]] = data_type_names[data_pkm_types_unparsed[i][1]]
        elif(data_pkm_types_unparsed[i][2] == '2'):
            data_pkm_types_secondary[data_pkm_types_unparsed[i][0]] = data_type_names[data_pkm_types_unparsed[i][1]]


    data = {}

    for i in range(1, len(data_pkm)):
        # is not default
        if(data_pkm[i][7] == '0'):
            continue
        if(data_pkm[i][0] != data_pkm[i][2]):
            print("ERROR: pokemon id and species id do not match: " + data_pkm[i][0] + " " + data_pkm[i][2])
        data[data_pkm[i][0]] = {"name": data_pkm[i][1], 
                                "abilities": data_pkm_abilities[data_pkm[i][0]], 
                                "height": int(data_pkm[i][3]), 
                                "weight": int(data_pkm[i][4]), 
                                "primary_type": data_pkm_types_primary[data_pkm[i][0]],
                                "secondary_type": data_pkm_types_secondary[data_pkm[i][0]] if data_pkm[i][0] in data_pkm_types_secondary else "",
                                "legendary": bool(int(data_pkm_species[data_pkm[i][0]]["legendary"])),
                                "mythical": bool(int(data_pkm_species[data_pkm[i][0]]["mythical"])),
                                "baby": bool(int(data_pkm_species[data_pkm[i][0]]["baby"])),
                                "evo_from": int(data_pkm_species[data_pkm[i][0]]["evolves_from"]) if data_pkm_species[data_pkm[i][0]]["evolves_from"] != '' else 0,
                                "evo_method": data_pkm_evo[data_pkm[i][0]] if data_pkm[i][0] in data_pkm_evo else "",
                                "evo_to": [],
                                "gen": int(data_pkm_species[data_pkm[i][0]]["gen"]),
                                "forms": []}

    for i in data:
        if(data[i]["evo_from"] != 0):
            data[str(data[i]["evo_from"])]["evo_to"].append(int(i))


    for i in range(1, len(data_pkm)):
        # is default
        if(data_pkm[i][7] == '1'):
            continue
        data[data_pkm[i][2]]["forms"].append({"id": int(data_pkm[i][0]),
                                            "name": data_pkm[i][1],
                                            "abilities": data_pkm_abilities[data_pkm[i][0]],
                                            "height": int(data_pkm[i][3]),
                                            "weight": int(data_pkm[i][4]),
                                            "primary_type": data_pkm_types_primary[data_pkm[i][0]],
                                            "secondary_type": data_pkm_types_secondary[data_pkm[i][0]] if data_pkm[i][0] in data_pkm_types_secondary else ""})

    # save data to json file
    with open('./data/data.json', 'w') as outfile:
        json.dump(data, outfile)

main()