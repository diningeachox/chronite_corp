import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
import * as Assets from "./assets.js";
import {info_panel} from "./scenes.js";
import {StatPanel} from "./scenes.js";
import lane from "./entities/lane.js";
import {basic_ship, cutter, tanker, fleet} from "./entities/ship.js";
import {pointvcircle, circlevcircle} from "./collision.js";

var canvas = Assets.canvas;


var planet_type = ["hq", "standard", "hostile"];
var field_types = ["speed", "slow", "nebula", "pyrite"];
var receiveables = ["Restoration", "Construction", "Munition", "Scout"]
const max_cooldown = 60;
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
            if (flags["mouse_down"] && flags["field"] != null) {
                console.log(intersects[0].object.position);
                console.log(Assets.ortho_camera);
            }
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
                            info_panel.buttons[0].enabled = (entity.components.lane.value != null);
                        } else {
                            //Create route to this planet
                            if (game.selected_entity != null){
                                var originplanet = game.selected_entity;
                                var destinationplanet = entity;
                                var outputgood = originplanet.components.outputgood.value;
                                //Only create lane if the destination planet's inputs match origin planet's outputs
                                //debugger;
                                if (entity.components.inputgoods.value.hasOwnProperty(outputgood) || receiveables.includes(outputgood)){
                                    //Check for duplicates!!!!
                                    if (originplanet.components.lane.value == null){
                                        const l = lane({origin: originplanet, destination: destinationplanet});
                                        //Populate the lane dictionary
                                        lanes[originplanet.id+","+destinationplanet.id] = l;
                                        originplanet.components.lane.value = l;

                                    } else {
                                        //Warning message
                                    }
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

ECS.systems.updateEntities = function systemUpdateEntities(game, delta){

    for (var key of Object.keys(ECS.entities)){
        var ent = ECS.entities[key];

        if (planet_type.includes(ent.components.type.value)){
            //Update Planets
            var inputs = ent.components.inputgoods.value;
            if (ent.components.cooldown.value > 0) ent.components.cooldown.value -= delta;
            //Send ships if planet has a lane and has ships
            var lane = ent.components.lane.value;
            if (lane != null ){
                //debugger;
                if (!ent.components.ships.value.isEmpty()){
                    if (ent.components.cooldown.value <= 0){
                        ent.components.cooldown.value = max_cooldown;
                        //Send ship at top of queue (if only there are enough inputs)
                        if (hasEnoughInputs(ent)){
                            var ship = ent.components.ships.value.pop();
                            ship.components.active.value = true;
                            ship.components.carry.value = ship.components.capacity.value;
                            expendInputs(ent); //Subtract input resources
                        }
                    }
                }
            }

            //Overabundance penalty
            for (var key of Object.keys(inputs)){
                if (inputs[key].current > inputs[key].max && game.frame % 40 == 0) ent.components.hp.value = Math.max(0, ent.components.hp.value - 1);
            }

            //Update HP bar
            matching_sphere[ent.components.asset.value].stat.scale.x = 0.1 * ent.components.hp.value / 100;

            //Update lanes

        } else if (ent.components.type.value == "ship"){
            //Update active ships
            if (ent.components.active.value){
                var planet = ent.components.planet.value;
                if (planet != null) {
                    var lane = planet.components.lane.value;
                    if (lane != null){
                        var dest = lane.components.destinationplanet.value; //Destination planet
                        var dir = dest.components.position.value.subtract(ent.components.position.value);
                        var target = "dest";
                        if (ent.components.carry.value == 0){
                            //Return to orig planet if ship is empty
                            dir = planet.components.position.value.subtract(ent.components.position.value);
                            target = "orig";
                        }
                        var distance = dir.modulus();
                        var angle = dir.angle();
                        //debugger;
                        if (distance < ent.components.speed.value * delta){
                            if (target == "dest"){
                                //Ships drop off goods
                                var dest_inputs = dest.components.inputgoods.value;

                                //Goods that require the destinationplanet's input goods to match
                                if (!receiveables.includes(ent.components.outputgood.value)){
                                    dest_inputs[ent.components.outputgood.value].current += ent.components.carry.value;
                                } else {
                                }
                                ent.components.carry.value = 0;

                            } else {
                                //Ships load up goods
                                ent.components.active.value = false;
                                planet.components.ships.value.enqueue(ent);
                            }
                        } else {
                            //Check field effects
                            var modifier = 1.0;

                            for (const key of Object.keys(fields)){
                                var f = matching_entity[key];
                                var in_field = pointvcircle(ent.components.position.value, f.components.position.value, f.components.size.value);
                                if (in_field){
                                    var field_type = f.components.type.value;
                                    if (field_type == "speed"){
                                        modifier *= 1.8;
                                    } else if (field_type == "slow"){
                                        modifier /= 1.8;
                                    } else if (field_type == "nebula"){

                                    } else if (field_type == "pyrite"){

                                    }
                                    break;
                                }
                            }

                            //Move ship toward target
                            var movement = dir.normalize().scalarMult(ent.components.speed.value * modifier * delta);
                            ent.components.position.value = ent.components.position.value.add(movement);
                            //Move sprite with actual ship position
                            var sprite = Assets.scene.getObjectByProperty("uuid", ent.components.asset.value);
                            sprite.position.x = ent.components.position.value.x;
                            sprite.position.y = ent.components.position.value.y;
                            sprite.material.rotation = angle + Math.PI / 2;
                        }
                    } else {
                        //All ships go back to origin planet
                        var dir = planet.components.position.value.subtract(ent.components.position.value);
                        var distance = dir.modulus();
                        var angle = dir.angle();
                        //debugger;
                        if (distance < ent.components.speed.value * delta){
                            //Ships load up goods
                            ent.components.active.value = false;
                            ent.components.carry.value = 0;

                            planet.components.ships.value.enqueue(ent);

                        } else {
                            var modifier = 1.0;

                            for (const key of Object.keys(fields)){
                                var f = matching_entity[key];
                                var in_field = pointvcircle(ent.components.position.value, f.components.position.value, f.components.size.value);
                                if (in_field){
                                    var field_type = f.components.type.value;
                                    if (field_type == "speed"){
                                        modifier *= 1.8;
                                    } else if (field_type == "slow"){
                                        modifier /= 1.8;
                                    } else if (field_type == "nebula"){

                                    } else if (field_type == "pyrite"){

                                    }
                                    break;
                                }
                            }
                            var movement = dir.normalize().scalarMult(ent.components.speed.value * modifier * delta);
                            ent.components.position.value = ent.components.position.value.add(movement);
                            //Move sprite with actual ship position
                            var sprite = Assets.scene.getObjectByProperty("uuid", ent.components.asset.value);
                            sprite.position.x = ent.components.position.value.x;
                            sprite.position.y = ent.components.position.value.y;
                            sprite.material.rotation = angle + Math.PI / 2;
                        }
                    }
                }
            }
        } else if (field_types.includes(ent.components.type.value)){
            if (ent.components.cooldown.value > 0) ent.components.cooldown.value -= delta;
        }
    }
}

ECS.systems.cleanUp = function systemCleanUp (game, delta) {
    for (var key of Object.keys(fields)){
        var field_ent = matching_entity[key];
        var field_mesh = fields[key];
        if (field_ent.components.cooldown.value <= 0){
            //Delete geometry and mesh from THREE.js scene
            field_mesh.geometry.dispose();
            field_mesh.material.dispose();
            Assets.scene.remove( field_mesh );

            //Delete from entity dictionaries
            delete matching_entity[key];
            delete fields[key];
        }
    }
}

ECS.systems.renderEntities = function systemRender (game, delta) {
    for (var key of Object.keys(ECS.entities)){
        var ent = ECS.entities[key];

        if (planet_type.includes(ent.components.type.value)){
            var scouted = ent.components.scouted.value;
            var mat = materials[ent.components.asset.value][scouted];
            var mesh = Assets.scene.getObjectByProperty("uuid", ent.components.asset.value);
            mesh.material = mat;
            matching_sphere[ent.components.asset.value].stat.visible = Boolean(scouted);
            if (scouted){
                var planet = Assets.scene.getObjectByProperty("uuid", ent.components.asset.value);
                planet.rotation.x -= delta / 400;
                planet.rotation.y -= delta / 100;
            }



        }
    }
}

function hasEnoughInputs(entity){
    var ret = true;
    for (const input of Object.keys(entity.components.inputgoods.value)){
        ret = entity.components.inputgoods.value[input].current >= 1;
        if (!ret) return ret;
    }
    return ret;
}

function expendInputs(entity){
    for (const input of Object.keys(entity.components.inputgoods.value)){
        entity.components.inputgoods.value[input].current = Math.max(0, entity.components.inputgoods.value[input].current - 1);
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
