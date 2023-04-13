class SceneManager {
    constructor(){
        this.cur_scene = null;
    }
    update(delta){
        this.cur_scene.update(delta);
    }
    render(delta){
        this.cur_scene.render(delta);
    }
}

//Abstract scene class
class Scene {
  constructor() {
    if (this.constructor == Scene) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.buttons = [];
  }

  update(delta) {
    throw new Error("Method 'update()' must be implemented.");
  }

  render(delta) {
    throw new Error("Method 'render()' must be implemented.");
  }

  handleMouseClick(mouseX, mouseY){
      for (var i = 0; i < this.buttons.length; i++){
          this.buttons[i].handleMouseClick(mouseX, mouseY);
      }
  }
  handleMouseHover(mouseX, mouseY){
      for (var i = 0; i < this.buttons.length; i++){
          this.buttons[i].handleMouseHover(mouseX, mouseY);
      }
  }

  load() {
    for (var i = 0; i < this.buttons.length; i++){
        this.buttons[i].hover = 0;
    }
  }

  unload() {
    throw new Error("Method 'unload()' must be implemented.");
  }
}

/**
 * Menu class, extends Scene class
 */
class Menu extends Scene {
    constructor(){
      super();
      this.name = "menu";
      //Clicking play will change scene from "menu" to "game"
      var play_button = new Button({x: canvas.width / 2, y:200, width:150, height:50, label:"Play",
            onClick: function(){
                changeScene(game_scene);
            }
           });
      var ins_button = new Button({x: canvas.width / 2, y:300, width:150, height:50, label:"Instructions",
            onClick: function(){
                changeScene(ins_scene);
            }
          });
      this.buttons = [play_button, ins_button];
    }
    update(delta) {}
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "beige";
        c.fillRect(0, 0, canvas.width, canvas.height);
        //title
        c.font="80px Arial";
        c.fillStyle = "black";
        c.textAlign = "center";
        c.fillText("Javascript Game", canvas.width/2, 90);

        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }
    }
    unload(){
    }
}

/**
 * Game class, extends Scene class
 */
class GameScene extends Scene {
    constructor(game){
      super();
      this.name = "game";
      //Current Game
      this.game = game;
      //Buttons
      var menu_button = new Button({x: canvas.width / 2, y:canvas.height - 100, width:150, height:50, label:"Menu",
            onClick: function(){
                changeScene(menu);
            }
           });
      this.buttons = [menu_button];
    }
    update(delta) {
        this.game.score += delta;
    }
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = "beige";
        c.fillRect(0, 0, canvas.width, canvas.height);
        //title
        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }

        c.fillStyle = "black";
        c.font="20px Arial";
        c.fillText("Score: " + this.game.score, 500, 400);
    }
    load(){
      //Load new game, plus all assets
        super.load();
        this.game = new Game();
        console.log("New game");
    }
    unload(){
        this.game = null;
    }
}

/**
 * Game class, extends Scene class
 */
class Ins extends Scene {
    constructor(){
      super();
      this.name = "ins";
      //Buttons
      var menu_button = new Button({x: canvas.width / 2, y:canvas.height - 100, width:150, height:50, label:"Back",
            onClick: function(){
                changeScene(menu);
            }
           });

     var play_button = new Button({x: canvas.width / 2, y:200, width:150, height:50, label:"Play",
           onClick: function(){
               changeScene(game_scene);
           }
          });
      this.buttons = [menu_button, play_button];
    }
    update(delta) {
        game.score += delta;
    }
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = "beige";
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.font="80px Arial";
        c.fillStyle = "black";
        c.textAlign = "center";
        c.fillText("Instructions", canvas.width/2, 90);
        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }

        c.font="20px Arial";

        c.fillStyle = "black";
        c.fillText("Well ya do a little o' this and a little o' that...", canvas.width/2, 290);
    }
    unload(){
    }
}

//Change scenes
function changeScene(new_scene){
    if (sm.cur_scene != null) sm.cur_scene.unload();
    new_scene.load();
    sm.cur_scene = new_scene;
}


// A pause scene, but more convenient to not put it into a class
function drawPause(){

    ol.clearRect(0, 0, overlay.width, overlay.height);
    ol.fillStyle = "rgba(0, 0, 0, 0.5)"; //Transparent black
    ol.fillRect(0, 0, overlay.width, overlay.height);
    ol.font = "50px arial";
    ol.fillStyle = "black";
    ol.fillText("PAUSED", overlay.width / 2 - 100, overlay.height / 2);

}
