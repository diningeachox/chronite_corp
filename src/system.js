import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
import * as Assets from "./assets.js";
import {StatPanel} from "./scenes.js";
import lane from "./entities/lane.js";
import {basic_ship, cutter, tanker, fleet} from "./entities/ship.js";

var canvas = Assets.canvas;

ECS.systems.selection = function systemSelection (game) {
    //Check raycasting intersections
    var INTERSECTED;
    Assets.raycaster.setFromCamera( Assets.pointer, Assets.ortho_camera );

    const intersects = Assets.raycaster.intersectObjects( Assets.scene.children, false );

    //Make all selection spheres invisible
    for (var key of Object.keys(matching_sphere)){

        if (game.selected_entity != matching_entity[key]){
            matching_sphere[key].sel.material.opacity = 0.0;
            matching_sphere[key].sel.material.color.setRGB(1, 1, 1);
        }
    }

    if ( intersects.length > 0 ) {
        if (intersects[0].object) {
            //console.log(intersects[0].object);
            if (matching_sphere.hasOwnProperty(intersects[0].object.uuid)){
                matching_sphere[intersects[0].object.uuid].sel.material.opacity = 0.3;
                var entity = matching_entity[intersects[0].object.uuid];

                //Render overlays (such as planet stats) as a panel
                game.hovered_entity = entity;
                var vector = new THREE.Vector3();
                var widthHalf = 0.5*canvas.width;
                var heightHalf = 0.5*canvas.height;
                vector.setFromMatrixPosition(intersects[0].object.matrixWorld);
                vector.project(Assets.ortho_camera);
                //Draw HP bar
                var hp_ratio = Math.max(0, matching_entity[intersects[0].object.uuid].components.hp.value / 100);
                var panel_pos_x = ( vector.x * widthHalf ) + widthHalf;
                var panel_pos_y = - ( vector.y * heightHalf ) + heightHalf;
                game.stat_panel.visible = true;
                game.stat_panel.x = panel_pos_x;
                game.stat_panel.y = panel_pos_y;
                //ol.fillRect(panel_pos_x, panel_pos_y, 100 * hp_ratio, 20);

                if (flags["mouse_click"]){
                    if (!entity.components.selected.value){
                        //Normal select
                        if (!flags["shift"]){
                            entity.components.selected.value = true;
                            //Turn selection sphere red
                            matching_sphere[intersects[0].object.uuid].sel.material.color.setRGB(0, 1, 0);
                            if (game.selected_entity != null){
                                game.selected_entity.components.selected.value = false;
                            }
                            game.selected_entity = entity;
                        } else {
                            //Create route to this planet
                            if (game.selected_entity != null){
                                var originplanet = game.selected_entity;
                                var destinationplanet = entity;
                                var outputgood = originplanet.components.outputgood.value;
                                //Only create lane if the destination planet's inputs match origin planet's outputs
                                //debugger;
                                if (entity.components.inputgoods.value.hasOwnProperty(outputgood.name.toLowerCase())){
                                    //Check for duplicates!!!!
                                    const l = lane({origin: originplanet, destination: destinationplanet});
                                    //Populate the lane dictionary
                                    lanes[new Set([originplanet.id, destinationplanet.id])] = l;

                                    //debugger;
                                    //Create and send fleet
                                    var x = originplanet.components.position.value.x;
                                    var y = originplanet.components.position.value.y;
                                    var ships = [basic_ship(x, y, outputgood), basic_ship(x, y, outputgood), tanker(x, y, outputgood)];

                                    var fl = fleet(x, y, l, ships);
                                }
                            }
                        }
                    } else {
                        entity.components.selected.value = false;
                        game.selected_entity = null;
                    }
                }
            } else {
                //No hover
                game.hovered_entity = null;
            }
        } else {
            game.hovered_entity = null;
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
                if (inputs[key].current > inputs[key].max && game.frame % 40 == 0) ent.components.hp.value -= 1;
            }

            //Update HP bar
            matching_sphere[ent.components.asset.value].stat.scale.x = 0.1 * ent.components.hp.value / 100;

            //Update lanes

        } else if (ent.components.type.value == "fleet"){
            //Update Fleets
            var ships = ent.components.ships.value;
            var total_goods = 0;
            var lane = ent.components.lane.value;
            var orig = lane.components.originplanet.value; //Origin planet
            var dest = lane.components.destinationplanet.value; //Destination planet
            var dir = null;
            var target = "dest";
            if (ships[0].components.carry.value > 0){
                //Drop off goods if capacity is > 0 and at destination planet
                dir = dest.components.position.value.subtract(ent.components.position.value);
            } else {
                dir = orig.components.position.value.subtract(ent.components.position.value);
                target = "orig";
            }
            var distance = dir.modulus();

            //debugger;
            if (distance < ent.components.speed.value * delta){

                for (var i = 0; i < ships.length; i++){
                    if (target == "dest"){
                        //Ships drop off goods
                        total_goods += ships[i].components.carry.value;
                        ships[i].components.carry.value = 0;
                    } else {
                        //Ships load up goods
                        ships[i].components.carry.value = ships[i].components.capacity.value;
                    }
                }
                //Add total goods to destination planet
                if (total_goods > 0){
                    var dest_inputs = dest.components.inputgoods.value;
                    var good_name = ships[0].components.outputgood.value.name.toLowerCase();
                    dest_inputs[good_name].current += total_goods;
                }
            } else {
                //Move towards it
                var movement = dir.normalize().scalarMult(ent.components.speed.value * delta);
                ent.components.position.value = ent.components.position.value.add(movement);
                for (var i = 0; i < ships.length; i++){
                    var sprite = Assets.scene.getObjectByProperty("uuid", ships[i].components.asset.value);
                    ships[i].components.position.value = ships[i].components.position.value.add(movement);
                    sprite.position.x = ships[i].components.position.value.x;
                    sprite.position.y = ships[i].components.position.value.y;
                }
            }

        }
    }

}



ECS.systems.renderEntities = function systemRender (game, delta) {
    for (var key of Object.keys(ECS.entities)){
        var ent = ECS.entities[key];

        if (planet_type.includes(ent.components.type.value)){
            var planet = Assets.scene.getObjectByProperty("uuid", ent.components.asset.value);
            planet.rotation.x -= delta / 400;
            planet.rotation.y -= delta / 100;

        }
    }
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
