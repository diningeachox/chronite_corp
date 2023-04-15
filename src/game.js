import * as Scene from './scenes.js';
import * as Assets from './assets.js';

//Variables from assets.js
var canvas = Assets.canvas;
var overlay = Assets.overlay;
var c = Assets.c;
var ol = Assets.ol;
var gl = Assets.gl;

// Game pause toggle
var pause = 0;

//Game frames
var frame_rate = 60;
var MS_PER_UPDATE = 1000 / frame_rate;
var lag = 0;
var prev = Date.now();
var elapsed;

// Game scenes
export var game;
export var game_scene;
export var ins_scene;
export var menu;

function resize() {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    overlay.width = window.innerWidth / 2;
    overlay.height = window.innerHeight;
    gl.width = window.innerWidth;
    gl.height = window.innerHeight;
};

export function init(){
    //Resize canvas and overlay to window
    resize();

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

    //Mouse move
    canvas.addEventListener('mousemove', function(e){
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //Current scene's Buttons
        sm.cur_scene.handleMouseHover(mouseX, mouseY);
    }, false);

    //Key presses
    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 80) { //P key
            if (sm.cur_scene.name === "game") pause = (pause + 1) % 2;
        }
        //Debug only
        else if(e.keyCode == 38) { //up key (raise water level)
            console.log("Up key pressed");
        }
        else if(e.keyCode == 40) { //down key (lower water level)
            console.log("Down key pressed");
        }
    });

    window.requestAnimationFrame(gameLoop);
}

//The game simulation
class Game {
    constructor(){
        this.score = 0;
        Assets.SpriteFactory('./sprites/ship1.png', 0);
        Assets.SpriteFactory('./sprites/ship1.png', 1);
    }
    update(delta){
        this.score += delta;
        sprites[0].position.set(this.score, this.score, 0);
        sprites[0].material.rotation = this.score / 10.0;
        sprites[1].position.set(this.score, -this.score, 0);
    }
    render(delta){

        c.fillStyle = "white";
        c.font="20px Arial";
        c.fillText("Score: " + this.score, 500, 400);

        Assets.camera.updateMatrixWorld();
        //Assets.controls.update();
        Assets.renderer.render( Assets.scene, Assets.ortho_camera );
    }
}



//Game loop
function gameLoop(current){
    current = Date.now();
    elapsed = current - prev;
    prev = current;
    lag += elapsed;

    if (pause == 0){
        while (lag >= MS_PER_UPDATE) {
            //Update
            var t1 = Date.now();
            sm.update(1);
            var t2 = Date.now();
            //console.log("Time taken to update:" + (t2 - t1) + "ms.");
            lag -= MS_PER_UPDATE;
        }
        //console.log(lag);

        ol.clearRect(0, 0, overlay.width, overlay.height);
    } else {
        drawPause();
    }
    //Render
    sm.render(lag / MS_PER_UPDATE);


    //window.cancelAnimationFrame(req);

    window.requestAnimationFrame(gameLoop);

}
