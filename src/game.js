import * as Scene from './scenes.js';
import * as Assets from './assets.js';
import {clip} from "./utils.js";
import {Vector2D} from "./vector2D.js";
import {hqPlanet, startingPlanet} from "./entities/planet.js";

//Variables from assets.js
var canvas = Assets.canvas;
var overlay = Assets.overlay;
var c = Assets.c;
var ol = Assets.ol;
var gl = Assets.gl;

//Debug mode toggle
var DEBUG = false;

// Game pause toggle
var pause = 0;

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

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.left = "0px";
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.left = "0px";
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
    game = new Game();
    game_scene = new Scene.GameScene(game);
    ins_scene = new Scene.Ins();

    //Add Event listeners
    //Mouse down
    canvas.addEventListener('click', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        sm.cur_scene.handleMouseClick(mouseX, mouseY);
    }, false);

    canvas.addEventListener('mousedown', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        flags["mouse_down"] = true;
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
        }
    });

    window.requestAnimationFrame(gameLoop);
}

//The game simulation
class Game {
    constructor(){
        this.score = 0;

        this.selected_entity = null;
        //Create starting planets
        var pl = startingPlanet(0, 0, 0);

        var pl2 = startingPlanet(1, 25.0, 5.4);

        Assets.SpriteFactory('../sprites/ship1.png', 0);
        Assets.SpriteFactory('../sprites/ship1.png', 1);

        //Assets.LaneFactory(new Vector2D(-8.0, 0), new Vector2D(1.0, 30), 100);
        //Assets.StarFactory(-8.0, 0, 222);
        //Assets.StarFactory(15.0, -10.0, 223);
        //Assets.StarFactory(1.0, 30.0, 224);
        sprites[0].position.set(0.0, 0.0, 0.0);
        sprites[1].position.set(10.0, 5.0, 0.0);
    }
    update(delta){
        this.score += delta;
        sprites[0].material.rotation = this.score / 10.0;
        //ECS.entities[222].rotation.set(0.0, this.score / 100.0, 0.0);
        //ECS.entities[223].rotation.set(this.score / 300.0, -this.score / 100.0, 0.0);
        //ECS.entities[224].rotation.set(this.score / 300.0, 0.0, -this.score / 500.0);

        ECS.systems.selection(this);

    }
    render(delta){
        //Frame rate
        c.fillStyle = "white";
        c.font="20px Arial";
        c.fillText("FPS: " + fps, 700, 40);

        Assets.plane_uniforms.u_time.value += delta;
        Assets.ortho_camera.updateMatrixWorld();
        Assets.controls.update();

        Assets.renderer.render(Assets.scene, Assets.ortho_camera);
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
    } else {
        lag = 0;

    }
    //Render
    sm.render(lag / MS_PER_UPDATE);

    if (pause) {
        Scene.drawPause();
        //Pause music
    }
    window.requestAnimationFrame(gameLoop);

}
