import * as Assets from "./assets.js";
import lane from "./entities/lane.js";
import {basic_ship, cutter, tanker, fleet} from "./entities/ship.js";


ECS.systems.selection = function systemSelection (game) {
    //Check raycasting intersections
    var INTERSECTED;
    Assets.raycaster.setFromCamera( Assets.pointer, Assets.ortho_camera );

    const intersects = Assets.raycaster.intersectObjects( Assets.scene.children, false );

    //Make all selection spheres invisible
    for (var key of Object.keys(matching_sphere)){

        if (game.selected_entity != matching_entity[key]){
            matching_sphere[key].material.opacity = 0.0;
            matching_sphere[key].material.color.setRGB(1, 1, 1);
        }
    }

    if ( intersects.length > 0 ) {
        if (intersects[0].object) {
            //console.log(intersects[0].object);
            if (matching_sphere.hasOwnProperty(intersects[0].object.uuid)){
                matching_sphere[intersects[0].object.uuid].material.opacity = 0.3;
                var entity = matching_entity[intersects[0].object.uuid];
                if (flags["mouse_click"]){
                    if (!entity.components.selected.value){
                        //Normal select
                        if (!flags["shift"]){
                            entity.components.selected.value = true;
                            //Turn selection sphere red
                            matching_sphere[intersects[0].object.uuid].material.color.setRGB(0, 1, 0);
                            if (game.selected_entity != null){
                                game.selected_entity.components.selected.value = false;
                            }
                            game.selected_entity = entity;
                        } else {
                            //Create route to this planet
                            if (game.selected_entity != null){
                                var originplanet = game.selected_entity;
                                var destinationplanet = entity;

                                //Check for duplicates!!!!
                                const l = lane({origin: originplanet, destination: destinationplanet});
                                //Populate the lane dictionary
                                lanes[new Set([originplanet.id, destinationplanet.id])] = l;

                                var outputgood = originplanet.components.outputgood.value;
                                //debugger;
                                //Create and send fleet
                                var x = originplanet.components.position.value.x;
                                var y = originplanet.components.position.value.y;
                                var ships = [basic_ship(x, y, outputgood), basic_ship(x, y, outputgood), tanker(x, y, outputgood)];

                                var fl = fleet(x, y, l, ships);
                            }
                        }
                    } else {
                        entity.components.selected.value = false;
                        game.selected_entity = null;
                    }
                }
            }
        }
    }
}

var planet_type = ["hq", "standard", "hostile"];
ECS.systems.updateEntities = function systemUpdateEntities(game, delta){

    for (var key of Object.keys(ECS.entities)){
        var ent = ECS.entities[key];

        if (planet_type.includes(ent.components.type.value)){
            //Update Planets
            var inputs = ent.components.inputgoods.value;

            //Overabundance penalty
            for (var key of Object.keys(inputs)){
                if (inputs[key].current > inputs[key].max) ent.components.hp.value -= 1;
            }

            //Update lanes

        } else if (ent.components.type.value == "fleet"){
            //Update Fleets
            var ships = ent.components.ships.value;
            var total_goods = 0;
            var lane = ent.components.lane.value;
            var orig = lane.components.originplanet.value; //Origin planet
            var dest = lane.components.destinationplanet.value; //Destination planet
            if (ships[0].components.carry.value > 0){
                //Drop off goods if capacity is > 0 and at destination planet
                var dir = dest.components.position.value.subtract(ent.components.position.value);
                var distance = dir.modulus();

                //debugger;
                if (distance < ent.components.speed.value * delta){
                    //Ships drop off goods
                    for (var i = 0; i < ships.length; i++){
                        total_goods += ships[i].components.carry.value;
                        ships[i].components.carry.value = 0;
                    }
                    //Add total goods to destination planet
                    var dest_inputs = dest.components.inputgoods.value;
                    var good_name = ships[0].components.outputgood.value.name.toLowerCase();
                    dest_inputs[good_name].current += total_goods;
                } else {
                    //Move towards it
                    var movement = dir.normalize().scalarMult(ent.components.speed.value * delta);
                    ent.components.position.value = ent.components.position.value.add(movement);
                    for (var i = 0; i < ships.length; i++){
                        ships[i].components.position.value = ships[i].components.position.value.add(movement);
                    }
                }
            } else {
                //Return to origin planet to pick up resources
                var dir = orig.components.position.value.subtract(ent.components.position.value);
                var distance = dir.modulus();
                if (distance < 0.05){
                    //Pick up goods
                    for (var i = 0; i < ships.length; i++){
                        ships[i].components.carry.value = ships[i].components.capacity.value;
                    }
                } else {
                    //Move towards it
                    var movement = dir.normalize().scalarMult(ent.components.speed.value);
                    ent.components.position.value = ent.components.position.value.add(movement);
                    for (var i = 0; i < ships.length; i++){
                        ships[i].components.position.value = ships[i].components.position.value.add(movement);
                    }
                }
            }
        }
    }

}



ECS.systems.render = function systemRender (entities, delta) {

}

function updateFleet(fleet, delta){
    //Calculate new position

    var increment = new Vector2D(0, 0);
    fleet.components.position.value = fleet.components.position.value.add(increment * speed);

    //Spread ships evenly
    for (var i = 0; i < fleet.components.ships.value.lenth; i++){
        var ship = fleet.components.ships.value[i];

    }

}
