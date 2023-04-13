var canvas = document.getElementById('canvas');
var overlay = document.getElementById('overlay');
var c = canvas.getContext("2d");
var ol = overlay.getContext("2d");
var pause = 0;

//Game frames
var frame_rate = 60;
MS_PER_UPDATE = 1000 / frame_rate;
var lag = 0;
var prev = Date.now();
var elapsed;

//Current game
let game;
let game_scene;
let ins_scene;

//Scene manager
let sm;
let menu;

function init(){
    //Resize canvas and overlay to window
    resize();
    
    sm = new SceneManager();
    menu = new Menu();

    sm.cur_scene = menu;
    game = new Game();
    game_scene = new GameScene(game);
    ins_scene = new Ins();

    //Add Event listeners
    //Mouse down
    canvas.addEventListener('mousedown', function(e){
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
        console.log(mouseX, mouseY);
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
function Game(){
    this.score = 0;
}

function update(delta){

}

function render(){
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
            t1 = Date.now();
            sm.update(1);
            t2 = Date.now();
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
