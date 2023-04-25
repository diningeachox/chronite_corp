import {FieldFactory} from "../assets.js";
import {Vector2D} from "../vector2D.js";
import {stats} from "../config.js";

const field = (config) => {
    const ent = new ECS.Entity();
    ent.addComponent( new ECS.Components.Position(config.position || new Vector2D(0, 0)));
    ent.addComponent( new ECS.Components.Size(config.size));
    ent.addComponent( new ECS.Components.Type(config.type || "speed"));
    ent.addComponent( new ECS.Components.Cooldown(700));
    var uuid = FieldFactory(ent.components.position.value.x,
                            ent.components.position.value.y,
                            ent.components.size.value,
                            ent.components.type.value);
    matching_entity[uuid] = ent;

    ent.addComponent( new ECS.Components.Asset(uuid));
    return ent;
}

const area_field = (x, y, type) => {return field({position: new Vector2D(x, y), size: stats.field_radius, type: type})};

export {area_field};
