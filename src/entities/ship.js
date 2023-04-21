import {ShipFactory} from "../assets.js";
import {Vector2D} from "../vector2D.js";
import goods from './goods.js';
import {scene} from "../assets.js";

const ship = (config) => {
    const ent = new ECS.Entity();
    ent.addComponent( new ECS.Components.Position(config.position || new Vector2D(0, 0)));
    ent.addComponent( new ECS.Components.HP(config.hp));
    ent.addComponent( new ECS.Components.Speed(config.speed));
    ent.addComponent( new ECS.Components.Capacity(config.capacity));
    ent.addComponent( new ECS.Components.Carry(0));
    ent.addComponent( new ECS.Components.Type("ship"));
    ent.addComponent( new ECS.Components.OutputGood(config.output || ""));
    ent.addComponent( new ECS.Components.Planet(null));
    ent.addComponent( new ECS.Components.Active(false));
    //ent.addComponent( new ECS.Components.Lane(config.lane));
    var uuid = ShipFactory(ent.components.position.value.x, ent.components.position.value.y, config.type);
    matching_entity[uuid] = ent;

    ent.addComponent( new ECS.Components.Asset(uuid));
    return ent;
}

//Ship types
const basic_ship = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 100, speed: 0.3, capacity: 1, output: good, type: 0})}
const tanker = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 500, speed: 0.15, capacity: 5, output: good, type: 1})} //Massive and slow but can store a lot
const cutter = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 100, speed: 0.45, capacity: 1, output: good, type: 2})}


//DOn't need anymore, delete
const group = (config) => {
    const ent = new ECS.Entity();
    ent.addComponent( new ECS.Components.Position(config.position || new Vector2D(0, 0)));
    ent.addComponent( new ECS.Components.Ships(config.ships)); //This is an array
    //A fleet is only as fast as its slowest ship
    var min_speed = Infinity;
    var num_ships = config.ships.length;
    var dest = config.lane.components.destinationplanet.value;
    var orig = config.lane.components.originplanet.value;
    var dir = dest.components.position.value.subtract(orig.components.position.value).normalize();
    var ortho = dir.rotate(Math.PI / 2);
    for (var i = 0; i < num_ships; i++){
        min_speed = Math.min(config.ships[i].components.speed.value, min_speed);
        //Graphical placement (doesn't affect gameplay)
        config.ships[i].components.position.value = config.position;
        var sprite = scene.getObjectByProperty("uuid", config.ships[i].components.asset.value);
        sprite.position.x = config.position.x;
        sprite.position.y = config.position.y;
        //Start ships with full load
        config.ships[i].components.carry.value = config.ships[i].components.capacity.value;
    }
    ent.addComponent( new ECS.Components.Speed(min_speed));
    ent.addComponent( new ECS.Components.Lane(config.lane));
    ent.addComponent( new ECS.Components.Type("fleet"));
    return ent;
}

const fleet = (x, y, lane, ships) => {
    return group({position: new Vector2D(x, y), ships: ships, lane: lane})
}

export {basic_ship, tanker, cutter, fleet};
