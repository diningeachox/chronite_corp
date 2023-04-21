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
    ent.addComponent( new ECS.Components.Scouted(config.scouted || true));
    ent.addComponent( new ECS.Components.Cooldown(0));
    ent.addComponent( new ECS.Components.Lane(config.lane || null)); //outgoing lane

    ent.addComponent( new ECS.Components.Ships(new Queue()));
    //Meshes (one for actual planet, one spherical mesh for selection)
    var uuid = StarFactory(ent.components.position.value.x, ent.components.position.value.y);
    matching_entity[uuid] = ent;
    //var meshes = StarFactory(ent.components.position.value.x, ent.components.position.value.y, 0);
    ent.addComponent( new ECS.Components.Asset(uuid));

    //Producer planets start with 3 basic ships
    if (ent.components.outputgood.value != "Null"){
        for (var i = 0; i < 3; i++){
            var ship = basic_ship(ent.components.position.value.x,
                        ent.components.position.value.y,
                        ent.components.outputgood.value);
            ship.components.planet.value = ent;
            ent.components.ships.value.enqueue(ship);
        }
    }
    return ent;
}

/*
const hqPlanet = planet({type: "hq", input:{
                                      metacrystals: {max:1000, current:0},
                                      Hyperchronite: {max:1000, current:0},
                                      Infrachronite: {max:1000, current:0},
                                      Deuterium: {max:1000, current:0},
                                      Pyrite: {max:1000, current:0}
                                      },
                                      ships:0}); //TODO use objects for planet types
*/
// The idea here is that we'll want to start with one of each
// of a basic set of planets that provide everything.
const startingPlanet = (i, x, y) => {
  const config = {input: {}, type: "standard"};
  switch (i) {
    case 1:
      config.input.Metacrystals = {max:30, current:0};
      config.input.Hyperchronite = {max:30, current:0};
      config.input.Infrachronite = {max:30, current:0};
      config.input.Deuterium = {max:30, current:0};
      config.input.Pyrite = {max:30, current:0};
    case 2:
      config.output = "Antimatter";
      break;
    case 3:
      config.output = "Basic";
      config.input.Antimatter = {max:30, current:0};
      break;
    case 4:
      config.output = "Hyperchronite";
      break;
    case 5:
      config.output = "Computronium";
      break;
    case 6:
      config.output = "Scout";
      config.input.Computronium = {max:30, current:0};
      break;
    case 7:
      config.output = "Infrachronite";
      break;
    case 8:
      config.output = "Metacrystals";
      config.input.Computronium = {max:30, current:0};
      config.input.Hyperchronite = {max:30, current:0};
      break;
  }
  config.position = new Vector2D(x, y);

  return planet(config);
}

//Outer planets yet to be explored
const outerPlanet = () => {
  const config = {input: {}, type: "standard", scouted: false};
  switch (i) {
    case 9:
      config.output = "Deuterium";
      break;
    case 10:
      config.output = "Pyrite";
      break;
    case 11:
      config.output = "Cutter";
      config.input.Hyperchronite = {max:50, current:0};
      config.input.Basic = {max:50, current:0};
      break;
    case 12:
      config.output = "Tanker";
      config.input.Infrachronite = {max:50, current:0};
      config.input.Basic = {max:50, current:0};
      break;
    case 13: //Hostile planet sends munitions
      config.output = "Munition";
      break;
    case 14: //Military planet
      config.output = "Munition";
      config.input.Antimatter = {max:30, current:0};
      break;
    case 23: //Bazzar
      config.output = "Metacrystals";
      config.input.Antimatter = {max:30, current:0};
      config.input.Computronium = {max:30, current:0};
      config.input.Hyperchronite = {max:30, current:0};
      config.input.Infrachronite = {max:50, current:0};
      config.input.Deuterium = {max:30, current:0};
      config.input.Pyrite = {max:30, current:0};
      break;
  }
  config.position = new Vector2D(x, y);

  return planet(config);
}

export {startingPlanet, outerPlanet};
