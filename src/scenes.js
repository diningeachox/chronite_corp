import * as Assets from './assets.js';
import * as Game from "./game.js";
import {Button, ResourceButton, Slider} from "./button.js";
import {playSound} from "./sound.js";

//Variables from assets.js
var canvas = Assets.canvas;
var overlay = Assets.overlay;
var c = Assets.c;
var ol = Assets.ol;

var bg = Assets.bg;
var bg_ctx = Assets.bg_ctx;

export class SceneManager {
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
export class Scene {
  constructor() {
    if (this.constructor == Scene) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.buttons = [];
    this.panels = [];
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
      for (var i = 0; i < this.panels.length; i++){
          this.panels[i].handleMouseClick(mouseX, mouseY);
      }
  }
  handleMouseHover(mouseX, mouseY){
      for (var i = 0; i < this.buttons.length; i++){
          this.buttons[i].handleMouseHover(mouseX, mouseY);
      }
      for (var i = 0; i < this.panels.length; i++){
          this.panels[i].handleMouseHover(mouseX, mouseY);
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


//Panels used in scenes
export class Panel extends Scene {
    constructor(x, y, w, h, title="Planet Info"){
        super();
        this.title = title;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.buttons = [];
      //this.panels = [];
    }
    addButton(button){
        this.buttons.push(button);
    }
    update(delta) {

    }
    render(delta){

        ol.fillStyle = "#FFFFFF8A";
        ol.fillRect(this.x, this.y, this.w, this.h);
        ol.lineWidth = 4;
        ol.strokeStyle = "white";
        ol.strokeRect(this.x, this.y, this.w, this.h);
        //Title
        ol.font="30px dialogFont";
        ol.fillStyle = "black";
        ol.textAlign = "center";
        ol.fillText(this.title, this.x + this.w/2, this.y + 40);

        //Buttons
        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(ol);
        }
    }
    load(){
    }
    unload(){
    }
}

export class ResourcePanel extends Panel {
    constructor(x, y, w, h){
        super(x, y, w, h, "");
        //this.visible = false;
    }
    update(delta) {

    }
    render(delta, planet){
        //super.render(delta);
        ol.font="15px dialogFont";
        ol.fillStyle = "black";
        ol.textAlign = "left";
        //ol.fillText("Resources", this.x + 10, this.y + 60);

        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(ol);
        }
    }
    load(){
    }
    unload(){
    }
}


export class StatPanel extends Panel {
    constructor(x, y, w, h){
        super(x, y, w, h, "Planet Statistics");
        this.visible = false;
    }
    update(delta) {

    }
    render(delta, planet){
        super.render(delta);
        ol.font="15px dialogFont";
        ol.fillStyle = "black";
        ol.textAlign = "left";
        ol.fillText("HP: " + planet.components.hp.value + "%", this.x + 10, this.y + 60);
        ol.fillText("Input Goods: ", this.x + 10, this.y + 80);
        var inputgoods = planet.components.inputgoods.value;
        var outputgood = planet.components.outputgood.value;
        var i = 1;
        for (var key of Object.keys(inputgoods)){
            ol.fillText(key+": "+inputgoods[key].current+"/"+inputgoods[key].max, this.x + 40, this.y + 80 + i * 20);
            i++;
        }
        if (Object.keys(inputgoods).length == 0) {
            ol.fillText("N/A", this.x + 40, this.y + 80 + i * 20);
            i++;
        }

        ol.fillText("Output Good: "+outputgood, this.x + 10, this.y + 80 + i * 20);
        i++;
        ol.fillText("Total ships: "+planet.components.shipnumber.value, this.x + 10, this.y + 80 + i * 20);
        i++;
        ol.fillText("Time until next ship: "+planet.components.cooldown.value, this.x + 10, this.y + 80 + i * 20);

    }
    load(){
    }
    unload(){
    }
}

/**
 * Menu class, extends Scene class
 */
export class Menu extends Scene {
    constructor(){
      super();
      this.name = "menu";
      //Clicking play will change scene from "menu" to "game"
      var play_button = new Button({x: canvas.width / 2, y:400, width:150, height:50, label:"Play",
            onClick: function(){
                changeScene(Game.game_scene);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });
      var regen_button = new Button({x: canvas.width / 2 + 100, y:400, width:50, height:50, label:"↻",
           onClick: function(){
               //Reset game level
               changeScene(Game.game_scene);
               playSound(sfx_sources["button_click"].src, sfx_ctx);
           }
          });
      var ins_button = new Button({x: canvas.width / 2, y:500, width:150, height:50, label:"Instructions",
            onClick: function(){
                changeScene(Game.ins_scene);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
          });
      var credits_button = new Button({x: canvas.width / 2, y:600, width:150, height:50, label:"Credits",
            onClick: function(){
                changeScene(Game.credits_scene);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
          });
      var quality_button = new ResourceButton({x: canvas.width / 2, y:canvas.height - 70, width:80, height:20, label:"",
            onClick: function(){
                playSound(sfx_sources["button_click"].src, sfx_ctx);
                quality = (quality + 1) % 2;
            }
          });
      quality_button.left_choice = "Off";
      quality_button.right_choice = "On";
      quality_button.visible = true;
      quality_button.enabled = true;
      this.buttons = [play_button, ins_button, quality_button, credits_button, regen_button];
      this.frame = 0;
    }
    update(delta) {
        frame++;
    }
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover2"], (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);
        var r = (canvas.width - canvas.height) / (2 * canvas.width);
        var gradient = c.createLinearGradient(0, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, "+ (Math.sin(frame / 80.0) * 0.1 + 0.1) +")");
        gradient.addColorStop(1 - r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover1"], (canvas.width - canvas.height) / 2 - canvas.height, 0, canvas.height, canvas.height);
        c.drawImage(images["cover3"], canvas.width - (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);

        gradient = c.createLinearGradient(0, 0, (canvas.width - canvas.height) / 2 + 10, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, (canvas.width - canvas.height) / 2, canvas.height);

        gradient = c.createLinearGradient(canvas.width - (canvas.width - canvas.height) / 2 - 10, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        c.fillStyle = gradient;
        c.fillRect(canvas.width - (canvas.width - canvas.height) / 2, 0, (canvas.width - canvas.height) / 2, canvas.height);

        //title
        c.font="80px dialogFont";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Chronite Corporation", canvas.width/2, 190);

        //c.fillStyle = "black";
        c.font="20px dialogFont";
        c.fillText("Dynamic Nebula (for powerful PCs)", canvas.width/2, canvas.height - 100);

        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }
    }
    load(){

    }
    unload(){
        //music_player.stop();
    }
}

export const info_panel = new Panel(window.innerWidth - 400 - 20, 100, 400, 250, "Planet Info");
export const resource_panel = new ResourcePanel(20, 20, window.innerWidth / 3 * 2, 180, "Resources");
/**
 * Game class, extends Scene class
 */
export class GameScene extends Scene {
    constructor(game){
      super();
      this.name = "game";
      //Current Game
      this.game = game;
      //Buttons
      var menu_button = new Button({x: canvas.width / 2, y:canvas.height - 100, width:150, height:50, label:"Menu",
            onClick: function(){
                changeScene(Game.menu);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });
      this.buttons = [menu_button];

      //Panels
      //Buttons
      var route_button = new Button({x: info_panel.x + info_panel.w/2, y: info_panel.y + info_panel.h - 60, width:250, height:40, label:"Recall Route",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                em.notify("recall", true);
            }
           });
      info_panel.addButton(route_button);

      var resource_button = new ResourceButton({x: info_panel.x + info_panel.w/2, y: info_panel.y + info_panel.h - 120, width:100, height:40, label:"",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
            }
           });
      info_panel.addButton(resource_button);

      var ship_button = new Button({x: info_panel.x + info_panel.w/2, y: info_panel.y + info_panel.h - 160, width:200, height:30, label:"Make Ship",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                em.notify("ship", "");
            }
           });
      ship_button.visible = false;
      ship_button.enabled = false;
      info_panel.addButton(ship_button);



      //Sliders
      /*
      var basic_ship_slider = new Slider({x: info_panel.x + info_panel.w/2, y: info_panel.y + info_panel.h - 460, width:250, height:50, label:"Basic Ship",
            onClick: function(){
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });
      info_panel.addButton(basic_ship_slider);

      var tanker_slider = new Slider({x: info_panel.x + info_panel.w/2, y: info_panel.y + info_panel.h - 360, width:250, height:50, label:"Tanker",
            onClick: function(){
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });
      info_panel.addButton(tanker_slider);
      */


      //AoE buttons
      var speed_button = new Button({x: resource_panel.x + 120, y: resource_panel.y + 80, width:100, height:30, label:"Speed Field",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                flags["field"] = "speed";
            }
           });
      speed_button.enabled = false;
      resource_panel.addButton(speed_button);

      var slow_button = new Button({x: resource_panel.x + 220, y: resource_panel.y + 80, width:100, height:30, label:"Slow Field",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                flags["field"] = "slow";
            }
           });
      slow_button.enabled = false;
      resource_panel.addButton(slow_button);

      var nebula_button = new Button({x: resource_panel.x + 320, y: resource_panel.y + 80, width:100, height:30, label:"Nebula Field",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                flags["field"] = "nebula";
            }
           });
      nebula_button.enabled = false;
      resource_panel.addButton(nebula_button);

      var pyrite_button = new Button({x: resource_panel.x + 420, y: resource_panel.y + 80, width:100, height:30, label:"Pyrite Field",
            onClick: function(){
                playSound(sfx_sources["click"].src, sfx_ctx);
                flags["field"] = "pyrite";
            }
           });
      pyrite_button.enabled = false;
      resource_panel.addButton(pyrite_button);

      this.panels = [info_panel, resource_panel];
    }
    update(delta) {
        this.game.update(delta);
    }
    render(delta){


        c.clearRect(0, 0, canvas.width, canvas.height);
        ol.clearRect(0, 0, canvas.width, canvas.height);
        if (!this.game.loading) {
            this.game.render(delta);


            //Buttons
            for (var i = 0; i < this.buttons.length; i++){
                this.buttons[i].draw(ol);
            }

            //Only render info panel if a planet/lane is selected
            if (this.game.selected_entity != null) info_panel.render(delta);
            resource_panel.render(delta);
        } else {
            ol.font="80px Arial";
            ol.fillStyle = "white";
            ol.textAlign = "center";
            ol.fillText("Generating galaxy...", canvas.width/2, canvas.height/2);
        }

        //Draw victory screen
        if (this.game.end){
            ol.fillStyle = "rgba(0, 0, 0, 0.4)";
            ol.fillRect(0, 0, overlay.width, overlay.height);
            ol.font="80px Arial";
            ol.fillStyle = "white";
            ol.textAlign = "center";
            ol.fillText("Congratulations!", canvas.width/2, canvas.height/2);
            ol.fillText("You have secured victory!", canvas.width/2, canvas.height/2 + 100);
        }

    }
    load(){
        super.load();
        //Play main game music
        music_player.stop();
        music_player.setBuffer(music_sources["main"]);
        music_player.play(true);

        if (quality % 2 == 0){

            bg_ctx.drawImage(images["bg"], 0, 0, bg.width, bg.height);
            bg_ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            bg_ctx.fillRect(0, 0, bg.width, bg.height);
        } else {
            if (Assets.scene.getObjectByProperty("uuid", Assets.plane_mesh_uuid) == null) Assets.scene.add(Assets.plane_mesh);
        }
    }
    unload(){
        //this.game = null;

        //Stop music
        music_player.stop();
    }
}



/**
 * Game class, extends Scene class
 */
export class Ins extends Scene {
    constructor(){
      super();
      this.name = "ins";
      //Buttons
      var menu_button = new Button({x: canvas.width / 2, y:canvas.height - 100, width:150, height:50, label:"Back",
            onClick: function(){
                changeScene(Game.menu);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });

     var play_button = new Button({x: canvas.width / 2, y:canvas.height - 200, width:150, height:50, label:"Play",
           onClick: function(){
               changeScene(Game.game_scene);
               playSound(sfx_sources["button_click"].src, sfx_ctx);
           }
          });
      this.buttons = [menu_button, play_button];
      this.page
    }
    update(delta) {
       frame++;
    }
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover2"], (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);
        var r = (canvas.width - canvas.height) / (2 * canvas.width);
        var gradient = c.createLinearGradient(0, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, "+ (Math.sin(frame / 80.0) * 0.1 + 0.1) +")");
        gradient.addColorStop(1 - r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover1"], (canvas.width - canvas.height) / 2 - canvas.height, 0, canvas.height, canvas.height);
        c.drawImage(images["cover3"], canvas.width - (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);

        gradient = c.createLinearGradient(0, 0, (canvas.width - canvas.height) / 2 + 10, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, (canvas.width - canvas.height) / 2, canvas.height);

        gradient = c.createLinearGradient(canvas.width - (canvas.width - canvas.height) / 2 - 10, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        c.fillStyle = gradient;
        c.fillRect(canvas.width - (canvas.width - canvas.height) / 2, 0, (canvas.width - canvas.height) / 2, canvas.height);

        c.font="80px dialogFont";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Instructions", canvas.width/2, 190);
        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }

        c.font="20px Arial";

        //Annotated images as instructions

        //c.fillStyle = "black";
        //c.fillText("Well ya do a little o' this and a little o' that...", canvas.width/2, 290);
    }
    unload(){
    }
}

export class Credits extends Scene {
    constructor(){
      super();
      this.name = "credits";
      //Clicking play will change scene from "menu" to "game"
      var play_button = new Button({x: canvas.width / 2, y:canvas.height - 200, width:150, height:50, label:"Play",
            onClick: function(){
                changeScene(Game.game_scene);
                playSound(sfx_sources["button_click"].src, sfx_ctx);
            }
           });
      var menu_button = new Button({x: canvas.width / 2, y:canvas.height - 100, width:150, height:50, label:"Back",
           onClick: function(){
               changeScene(Game.menu);
               playSound(sfx_sources["button_click"].src, sfx_ctx);
           }
          });
      this.buttons = [play_button, menu_button];
      this.frame = 0;
    }
    update(delta) {
        frame++;
    }
    render(delta){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover2"], (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);
        var r = (canvas.width - canvas.height) / (2 * canvas.width);
        var gradient = c.createLinearGradient(0, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, "+ (Math.sin(frame / 80.0) * 0.1 + 0.1) +")");
        gradient.addColorStop(1 - r, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.drawImage(images["cover1"], (canvas.width - canvas.height) / 2 - canvas.height, 0, canvas.height, canvas.height);
        c.drawImage(images["cover3"], canvas.width - (canvas.width - canvas.height) / 2, 0, canvas.height, canvas.height);

        gradient = c.createLinearGradient(0, 0, (canvas.width - canvas.height) / 2 + 10, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");
        c.fillStyle = gradient;
        c.fillRect(0, 0, (canvas.width - canvas.height) / 2, canvas.height);

        gradient = c.createLinearGradient(canvas.width - (canvas.width - canvas.height) / 2 - 10, 0, canvas.width, 0);
        // Add three color stops
        gradient.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        c.fillStyle = gradient;
        c.fillRect(canvas.width - (canvas.width - canvas.height) / 2, 0, (canvas.width - canvas.height) / 2, canvas.height);

        //title
        c.font="80px dialogFont";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Credits", canvas.width/2, 190);

        //c.fillStyle = "black";
        c.font="30px dialogFont";
        c.fillText("Programming/UI: Radar (Jack Ding)", canvas.width/2, 290);
        c.fillText("Design/Vector Graphics: munizao (Alexandre Muniz)", canvas.width/2, 390);
        c.fillText("Music/SFX: FidelDelgado (Fidel Delgado)", canvas.width/2, 490);

        for (var i = 0; i < this.buttons.length; i++){
            this.buttons[i].draw(c);
        }
    }
    load(){

    }
    unload(){
        //music_player.stop();
    }
}

//Change scenes
export function changeScene(new_scene){

    if (sm.cur_scene != null) sm.cur_scene.unload();
    new_scene.load();
    sm.cur_scene = new_scene;
}


// A pause scene, but more convenient to not put it into a class
export function drawPause(){

    ol.clearRect(0, 0, overlay.width, overlay.height);
    ol.fillStyle = "rgba(0, 0, 0, 0.5)"; //Transparent black
    ol.fillRect(0, 0, overlay.width, overlay.height);
    ol.font = "50px arial";
    ol.fillStyle = "black";
    ol.fillText("PAUSED", overlay.width / 2 - 100, overlay.height / 2);

}
