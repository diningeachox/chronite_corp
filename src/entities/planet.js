import goods from './goods.js';
import {Vector2D} from "../vector2D.js";
import {StarFactory} from "../assets.js";
import {Queue} from "../utils.js";
import {basic_ship, tanker, cutter} from "./ship.js";

const planet = (config) => {
    const ent = new ECS.Entity();
    ent.addComponent( new ECS.Components.Type(config.type || "standard"));
    ent.addComponent( new ECS.Components.HP(config.HP || 100));
    ent.addComponent( new ECS.Components.OutputGood(config.output || "Null"));
    ent.addComponent( new ECS.Components.InputGoods(config.input || {}));
    ent.addComponent( new ECS.Components.Position(config.position || new Vector2D(0, 0)));
    ent.addComponent( new ECS.Components.Hostile(config.hostile || false));
    ent.addComponent( new ECS.Components.Selected(false));
    ent.addComponent( new ECS.Components.Scouted(config.scouted));
    ent.addComponent( new ECS.Components.Cooldown(0));
    ent.addComponent( new ECS.Components.Lane(config.lane || null)); //outgoing lane
    ent.addComponent( new ECS.Components.Choices(config.choices || null));
    ent.addComponent( new ECS.Components.Name(config.name || ""));

    var starting_ships = config.starting_ships = ["basic", "basic", "basic"];

    ent.addComponent( new ECS.Components.Ships(new Queue()));

    //Meshes (one for actual planet, one spherical mesh for selection)
    var uuid = StarFactory(ent.components.position.value.x, ent.components.position.value.y, config.type);
    matching_entity[uuid] = ent;
    //var meshes = StarFactory(ent.components.position.value.x, ent.components.position.value.y, 0);
    ent.addComponent( new ECS.Components.Asset(uuid));

    //Producer planets start with 3 basic ships
    if (ent.components.outputgood.value != "Null"){
        for (var i = 0; i < starting_ships.length; i++){
            if (starting_ships[i] == "basic"){
                var ship = basic_ship(ent.components.position.value.x,
                            ent.components.position.value.y,
                            ent.components.outputgood.value);
                ship.components.planet.value = ent;
                ent.components.ships.value.enqueue(ship);
            } else if (starting_ships[i] == "cutter"){
                var ship = cutter(ent.components.position.value.x,
                            ent.components.position.value.y,
                            ent.components.outputgood.value);
                ship.components.planet.value = ent;
                ent.components.ships.value.enqueue(ship);
            } else if (starting_ships[i] == "tanker"){
                var ship = tanker(ent.components.position.value.x,
                            ent.components.position.value.y,
                            ent.components.outputgood.value);
                ship.components.planet.value = ent;
                ent.components.ships.value.enqueue(ship);
            }
        }
    }
    ent.addComponent( new ECS.Components.ShipNumber(ent.components.ships.value.size())); //Number of ships
    return ent;
}

function addShip(ent, type){
    //var type = ent.components.outputgood.value;
    var ship = basic_ship(ent.components.position.value.x,
              ent.components.position.value.y,
              ent.components.outputgood.value);
    if (type == "Cutter"){
        ship = cutter(ent.components.position.value.x,
                ent.components.position.value.y,
                ent.components.outputgood.value);
    } else if (type == "Tanker"){
        ship = tanker(ent.components.position.value.x,
              ent.components.position.value.y,
              ent.components.outputgood.value);
    }
    ship.components.planet.value = ent;
    ent.components.ships.value.enqueue(ship);
}

// The idea here is that we'll want to start with one of each
// of a basic set of planets that provide everything.
const startingPlanet = (i, x, y) => {
  const config = {input: {}, type: "standard", scouted: 1};
  switch (i) {
    case 1:
      config.input.Metacrystals = {max:30, current:0};
      config.input.Hyperchronite = {max:30, current:0};
      config.input.Infrachronite = {max:30, current:0};
      config.input.Deuterium = {max:30, current:0};
      config.input.Pyrite = {max:30, current:0};
      config.name = "Chronite Corporation HQ";
      break;
    case 2:
      config.output = "Antimatter";
      config.name = "Compact Energetics";
      break;
    case 3:
      config.output = "Basic";
      config.input.Antimatter = {max:30, current:0};
      config.name = "All Cluster Transport";
      break;
    case 4:
      config.output = "Hyperchronite";
      config.name = "Everfast City";
      break;
    case 5:
      config.output = "Computronium";
      config.name = "Petabyte Research Labs";
      break;
    case 6:
      config.output = "Scout";
      config.input.Computronium = {max:30, current:0};
      config.name = "Polytechnic Explorer's Institute";
      break;
    case 7:
      config.output = "Infrachronite";
      config.name = "Starset Resort";
      break;
    case 8:
      config.output = "Metacrystals";
      config.input.Computronium = {max:30, current:0};
      config.input.Hyperchronite = {max:30, current:0};
      config.name = "Cryptic Vaults";
      break;
  }
  config.position = new Vector2D(x, y);

  return planet(config);
}

//Outer planets yet to be explored
const outerPlanet = (i, x, y) => {
  const config = {input: {Scout: {max:10, current:0}}, type: "standard", scouted: 0};
  switch (i) {
    case 9:
      config.output = "Deuterium";
      config.name = "Titanica";
      break;
    case 10:
      config.output = "Pyrite";
      config.name = "New Tortuga";
      break;
    case 11:
      config.output = "Cutter";
      config.input.Hyperchronite = {max:50, current:0};
      config.input.Basic = {max:50, current:0};
      config.name = "Swift Logistics";
      break;
    case 12:
      config.output = "Tanker";
      config.input.Infrachronite = {max:50, current:0};
      config.input.Basic = {max:50, current:0};
      config.name = "Masslift Industries";
      break;
    case 13: //Hostile planet sends munitions
      config.output = "Munition";
      config.type = "hostile1";
      config.name = "The Robo-Rebels";
      break;
    case 14: //Military planet
      config.output = "Munition";
      config.input.Antimatter = {max:30, current:0};
      config.name = "Frontera Base";
      break;
    case 15:
      config.output = "Construction";
      config.input.Computronium = {max:30, current:0};
      config.name = "Modular Silo Holdings";
      break;
    case 16:
      config.output = "Hyperchronite";
      config.choices = ["Hyperchronite", "Infrachronite"];
      //config.input.Computronium = {max:30, current:0};
      config.name = "Time Whorls";
      break;
    case 17:
      config.output = "Deuterium";
      config.choices = ["Deuterium", "Pyrite"];
      config.name = "Correctional Mines";
      break;
    case 18:
      config.output = "Metacrystals";
      config.input.Deuterium = {max:30, current:0};
      config.input.Pyrite = {max:30, current:0};
      config.name = "THE (The Hidden Exchange)";
      break;
    case 19: //Hostile planet II
      config.starting_ships = ["cutter", "cutter", "cutter"];
      if (Math.random() > 0.5) config.starting_ships = ["tanker", "tanker", "tanker"];
      config.output = "Munition";
      config.type = "hostile2";
      config.name = "The Formic Nest";
      break;
    case 20:
      config.output = "Restoration";
      config.input.Infrachronite = {max:30, current:0};
      config.input.Computronium = {max:30, current:0};
      config.name = "Terraseed Nursery";
      break;
    case 21:
      config.output = "Antimatter";
      config.choices = ["Antimatter", "Computronium"];
      config.name = "Positronic Fabricators";
      break;
    case 22:
      config.output = "Munition";
      config.input.Antimatter = {max:30, current:0};
      config.name = "MilCorp Fortress";
      break;
    case 23: //Bazzar
      config.output = "Metacrystals";
      config.input.Currency = {max:100, current:0};
      config.name = "The Galactic Bazaar";
      break;
    case 24: //Hostile planet III
      config.starting_ships = ["basic", "basic", "cutter", "cutter", "tanker", "tanker"];
      config.output = "Munition";
      config.type = "hostile3";
      config.name = "The Clone Horde";
      break;
  }

  config.position = new Vector2D(x, y);
  return planet(config);
}


export {startingPlanet, outerPlanet, addShip};
