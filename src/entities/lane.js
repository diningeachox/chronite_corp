import {LaneFactory} from "../assets.js";

const lane = (config) => {
    const ent = new ECS.Entity();
    ent.addComponent( new ECS.Components.OriginPlanet(config.origin));
    ent.addComponent( new ECS.Components.DestinationPlanet(config.destination));
    ent.addComponent( new ECS.Components.Ships(0));
    ent.addComponent( new ECS.Components.Cooldown(0));
    ent.addComponent( new ECS.Components.Type("lane"));
    var orig = ent.components.originplanet.value;
    var dest = ent.components.destinationplanet.value;
    var uuid = LaneFactory(orig.components.position.value, dest.components.position.value);
    matching_entity[uuid] = ent;
    return ent;
}

export default lane;
