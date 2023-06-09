import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
import * as Scene from './scenes.js';
import * as Assets from './assets.js';
import {clip} from "./utils.js";
import {Vector2D} from "./vector2D.js";
import {startingPlanet, outerPlanet, addShip} from "./entities/planet.js";
import {basic_ship, tanker} from "./entities/ship.js";
import {area_field} from "./entities/aoe.js";
import lane from "./entities/lane.js";
import {pointvcircle, circlevcircle} from "./collision.js";
import {stats} from "./config.js";
import {playSound} from "./sound.js";
import {deleteEntity} from "./system.js";

//Variables from assets.js
var canvas = Assets.canvas;
var overlay = Assets.overlay;
var c = Assets.c;
var ol = Assets.ol;
var gl = Assets.gl;
var bg = Assets.bg;

//Debug mode toggle
var DEBUG = false;



//Game frames
var frame_rate = 60;
var MS_PER_UPDATE = 1000 / frame_rate;
var lag = 0;
var prev = Date.now();
var elapsed;

//FPS calculation
var real_frames = 0;
var fps = 0;

//Zoom level
var zoom = 1.0;

// Game scenes
export var game;
export var game_scene;
export var ins_scene;
export var menu;
export var credits_scene;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.left = "0px";
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.left = "0px";

    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
    bg.style.left = "0px";
};

export function init(){
    //Resize canvas and overlay to window
    resize();

    //Background
    Assets.plane_uniforms.u_resolution.value.x = Assets.gl.width;
    Assets.plane_uniforms.u_resolution.value.y = Assets.gl.height;

    sm = new Scene.SceneManager();
    menu = new Scene.Menu();

    sm.cur_scene = menu;
    //game = new Game();
    game_scene = new Scene.GameScene(null);
    ins_scene = new Scene.Ins();
    credits_scene = new Scene.Credits();

    //Subscribe to events
    /*
    em.subscribe("resource", game);
    em.subscribe("recall", game);
    em.subscribe("ship", game);
    em.subscribe("reset", game);
    */

    //Add Event listeners
    overlay.addEventListener('click', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        sm.cur_scene.handleMouseClick(mouseX, mouseY);
        flags["mouse_click"] = true;
    }, false);

    overlay.addEventListener('mousedown', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        flags["mouse_down"] = true;
    }, false);

    //Mouse move
    overlay.addEventListener('mousemove', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        sm.cur_scene.handleMouseHover(mouseX, mouseY);
        //Assets.plane_uniforms.u_mouse.value.x = mouseX
    }, false);

    overlay.addEventListener('mouseup', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        flags["mouse_down"] = false;
    }, false);

    //Mouse down
    canvas.addEventListener('click', function(e){
        if (e.button === 0){
            var rect = canvas.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;
            //Current scene's Buttons
            sm.cur_scene.handleMouseClick(mouseX, mouseY);
            flags["mouse_click"] = true;
        } else if (e.button === 2){
            flags["right_click"] = true;
        }
    }, false);

    canvas.addEventListener('mousedown', function(e){
        if (e.button === 0){
            var rect = canvas.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;
            //Current scene's Buttons
            flags["mouse_down"] = true;
        } else if (e.button === 2){
            flags["field"] = null;
            Assets.circle.material.opacity = 0.0;
        }
    }, false);

    //Mouse move
    canvas.addEventListener('mousemove', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        sm.cur_scene.handleMouseHover(mouseX, mouseY);
        //Assets.plane_uniforms.u_mouse.value.x = mouseX
    }, false);

    canvas.addEventListener('mouseup', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        flags["mouse_down"] = false;
        flags["right_click"] = false;
    }, false);

    //Mouse scroll wheel
    canvas.addEventListener('wheel', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        zoom += e.deltaY / 1000.0;
        //Assets.ortho_camera.position.z += e.deltaY / 10.0;
        zoom = clip(zoom, 0.1, 10);

        //Assets.ortho_camera.scale.set(zoom, zoom, 1);
    }, false);

    //Key presses
    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 80) { //P key
            if (sm.cur_scene.name === "game") pause = (pause + 1) % 2;
        } else if(e.keyCode == 16) { //Shift key
            flags["shift"] = true;
        }
    });

    document.addEventListener('keyup', function(e) {
        if(e.keyCode == 16) { //Shift key
            flags["shift"] = false;
        }
    });

    window.requestAnimationFrame(gameLoop);
}

//The game simulation
export class Game {
    constructor(){
        this.selected_entity = null;
        this.hovered_entity = null;

        this.loading = true;


        this.planets = [];
        //Create starting planets
        var startX = 0;
        var startY = 0;
        var startangle = 0;
        var dist = 42;
        for (var i = 1; i < 9; i++){
            this.planets.push(startingPlanet(i, startX, startY));
            startangle += (Math.PI / 3) * (0.5 + Math.random());
            var ring = Math.floor(startangle / (Math.PI * 2)) + 1;
            startX = dist * ring * Math.cos(startangle);
            startY = dist * ring * Math.sin(startangle);
        }


        //Create outer planets (initially unexplored)
        for (var i = 9; i < 25; i++){
            if (i == 13 || i == 19 || i == 24){
                this.planets.push(outerPlanet(i, Math.max(100, startX), Math.max(100, startX)));
            } else {
                this.planets.push(outerPlanet(i, startX, startY));
            }
            startangle += (Math.PI / 3) * (0.5 + Math.random());
            var ring = Math.floor(startangle / (Math.PI * 2)) + 1;
            startX = dist * ring * Math.cos(startangle);
            startY = dist * ring * Math.sin(startangle);
        }


        //Start route from 2 to 3
        const l = lane({origin: this.planets[1], destination: this.planets[2]});
        lanes[this.planets[1].id+","+this.planets[2].id] = l;
        this.planets[1].components.lane.value = l;

        this.hq = this.planets[0];

        //UI

        //Planet stats panel
        this.stat_panel = new Scene.StatPanel(20, 20, canvas.width / 6, canvas.width / 7);

        this.frame = 0;
        this.end = false;
        ECS.systems.renderEntities(this, 0);

        this.placing = false;

        this.loading = false;
    }

    process(event_type, data){
        //Process data from message streams
        if (event_type == "resource"){
            if (this.selected_entity != null && this.selected_entity.components.choices.value != null){
                this.selected_entity.components.outputgood.value = this.selected_entity.components.choices.value[data];
            }
        } else if (event_type == "recall"){
            //Delete mesh
            var lane = this.selected_entity.components.lane.value;
            deleteEntity(lane);
            this.selected_entity.components.lane.value = null;
            Scene.info_panel.buttons[0].enabled = false;
        } else if (event_type == "ship"){
            addShip(this.selected_entity, this.selected_entity.components.outputgood.value);
        } else if (event_type == "reset"){
            this.cleanUp();
        }
    }

    update(delta){
        if (flags["field"] != null){
            //debugger;
            var zoom = Assets.ortho_camera.zoom;
            var x = Assets.pointer.x * Assets.ortho_camera.right / zoom + Assets.ortho_camera.position.x;
            var y = Assets.pointer.y * Assets.ortho_camera.top / zoom + Assets.ortho_camera.position.y;
            //Check for collisions with other fields
            var collided = false;
            for (const key of Object.keys(fields)){
                var f = matching_entity[key];
                collided = circlevcircle(new Vector2D(x, y), stats.field_radius, f.components.position.value, f.components.size.value);
                if (collided) break;
            }

            if (flags["mouse_down"]) {
                //Make a field
                if (!collided){
                    var field = area_field(x, y, flags["field"]);
                    var resource_type = stats.costs[flags["field"]].resource;
                    this.hq.components.inputgoods.value[resource_type].current -= stats.costs[flags["field"]].quantity;
                    Assets.circle.material.opacity = 0.0;

                    playSound(sfx_sources[flags["field"]].src, sfx_ctx);
                    flags["field"] = null;
                }
            } else {
                //Make selection circle visible
                Assets.circle.position.x = x;
                Assets.circle.position.y = y;
                Assets.circle.material.opacity = 0.5;
                if (collided) {
                    Assets.circle.material.color.setHex(0xff0000);
                } else {
                    Assets.circle.material.color.setHex(0xffffff);
                }

            }

        }

        ECS.systems.selection(this);
        ECS.systems.updateEntities(this, delta);
        ECS.systems.updateHQ(this);
        ECS.systems.cleanUp(this, delta);

        var resources = this.hq.components.inputgoods.value;
        Scene.resource_panel.buttons[0].enabled = (resources.Hyperchronite.current >= stats.costs.speed.quantity);
        Scene.resource_panel.buttons[1].enabled = (resources.Infrachronite.current >= stats.costs.slow.quantity);
        Scene.resource_panel.buttons[2].enabled = (resources.Deuterium.current >= stats.costs.nebula.quantity);
        Scene.resource_panel.buttons[3].enabled = (resources.Pyrite.current >= stats.costs.pyrite.quantity);

        //Check win condition
        if (this.end || this.loss) {
            pause = 1;
        }

        //Reset flags
        flags["mouse_click"] = false;
        this.frame += 1;
    }
    render(delta){
        //Frame rate
        c.fillStyle = "white";
        c.font="20px dialogFont";
        c.fillText("FPS: " + fps, Assets.canvas.width - 100, 40);

        //Game icons and indicators



        //c.fillText("Metal: " + pl3.components.inputgoods.value.metal.current, 900, 40);
        //c.fillText("Chronium: " + pl3.components.inputgoods.value.chronium.current, 900, 80);
        Assets.plane_uniforms.u_time.value += delta;
        Assets.ortho_camera.updateMatrixWorld();
        Assets.controls.update();
        Assets.renderer.render(Assets.scene, Assets.ortho_camera);

        ECS.systems.renderEntities(this, delta);

        if (this.stat_panel.visible){
            this.stat_panel.render(delta, this.hovered_entity);
        }

        this.stat_panel.visible = false;

        //Top HUD
        ol.font = "30px dialogFont";
        ol.textAlign = "left";
        ol.fillStyle = "#89CFF0";
        ol.fillText("Metacrystals: " + this.hq.components.inputgoods.value.Metacrystals.current + "/" + stats.end, 40, 40);
        ol.fillStyle = "red";
        ol.fillText("HP: " + this.hq.components.hp.value + "%", 440, 40);

        //Field Resources
        ol.font = "12px dialogFont";
        ol.fillStyle = "#89CFF0";
        ol.drawImage(images["Hyperchronite"], Scene.resource_panel.x + 120 - 40, Scene.resource_panel.y + 110 - 8, 20, 20);
        ol.fillText(this.hq.components.inputgoods.value.Hyperchronite.current + "/6", Scene.resource_panel.x + 120, Scene.resource_panel.y + 110);
        ol.drawImage(images["Infrachronite"], Scene.resource_panel.x + 220 - 40, Scene.resource_panel.y + 110 - 8, 20, 20);
        ol.fillText(this.hq.components.inputgoods.value.Infrachronite.current + "/6", Scene.resource_panel.x + 220, Scene.resource_panel.y + 110);
        ol.drawImage(images["Deuterium"], Scene.resource_panel.x + 320 - 40, Scene.resource_panel.y + 110 - 8, 20, 20);
        ol.fillText(this.hq.components.inputgoods.value.Deuterium.current + "/6", Scene.resource_panel.x + 320, Scene.resource_panel.y + 110);
        ol.drawImage(images["Pyrite"], Scene.resource_panel.x + 420 - 40, Scene.resource_panel.y + 110 - 8, 20, 20);
        ol.fillText(this.hq.components.inputgoods.value.Pyrite.current + "/6", Scene.resource_panel.x + 420, Scene.resource_panel.y + 110);


    }

    cleanUp(){
        //Delete all meshes in the game
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

        //Get rid of entities and their meshes
        for (var key of Object.keys(ECS.entities)){
            var ent = ECS.entities[key];

            //Delete the MESH
            if (ent.components.hasOwnProperty("asset")){
                var asset = ent.components.asset.value;
                var mesh = Assets.scene.getObjectByProperty("uuid", asset);
                mesh.geometry.dispose();
                mesh.material.dispose();
                Assets.scene.remove(mesh);

                //Delete selection spheres & hp bars
                if (matching_sphere.hasOwnProperty(asset)){
                    Assets.scene.remove(matching_sphere[asset].sel);
                    Assets.scene.remove(matching_sphere[asset].stat);
                }

            }
            delete ECS.entities[key];
        }

        //Delete arrowhelpers
        for (var key of Object.keys(arrows)){
            var mesh = arrows[key];

            Assets.scene.remove(mesh);
            mesh.line.geometry.dispose();
            mesh.line.material.dispose();
            mesh.cone.geometry.dispose();
            mesh.cone.material.dispose();
        }

        //Empty out the dictionaries
        matching_sphere = {};
        matching_entity = {};
        lanes = {};
        fields = {};
        materials = {};
        sprites = {};
        arrows = {};
    }
}



//Game loop
function gameLoop(current){
    if (pause == 0){
        //Update FPS calculation once every 250 milliseconds
        if ((Date.now() - time) > 1000){
            fps = real_frames;
            real_frames = 0;
            time += 1000; //Go forward one second
        }
        current = Date.now();
        elapsed = current - prev;
        prev = current;
        lag += elapsed;

        while (lag >= MS_PER_UPDATE) {
            //Update
            var t1 = Date.now();
            sm.update(1);
            var t2 = Date.now();
            //console.log("Time taken to update:" + (t2 - t1) + "ms.");
            lag -= MS_PER_UPDATE;
        }
        //console.log(lag);
        real_frames += 1;
        ol.clearRect(0, 0, overlay.width, overlay.height);
    } else if (pause == 1){
        lag = 0;
        prev = Date.now();
    }
    //Render
    sm.render(lag / MS_PER_UPDATE);

    window.requestAnimationFrame(gameLoop);

}
