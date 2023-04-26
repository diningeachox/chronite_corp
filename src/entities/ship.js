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
const basic_ship = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 100, speed: 0.3, capacity: 1, output: good, type: 0})};
const tanker = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 500, speed: 0.10, capacity: 5, output: good, type: 1})}; //Massive and slow but can store a lot
const cutter = (x, y, good) => {return ship({position: new Vector2D(x, y), hp: 100, speed: 0.5, capacity: 1, output: good, type: 2})};




export {basic_ship, tanker, cutter};
