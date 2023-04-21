// Useful helper functions and data structures for the game


//Button class
/*
export var Button = function(config) {
    //x and y are coordinates of the CENTER of the button
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || 150;
    this.height = config.height || 50;
    this.label = config.label || "Click me!";
    this.onClick = config.onClick || function() {};
    this.hover = 0;
};

Button.prototype.draw = function(ctx) {
    //Normal button
    if (!this.hover){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        ctx.font="20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.x, this.y);
    } else {
        //Hovered over button
        ctx.fillStyle = "rgb(100, 100, 255)";
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        ctx.font="20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.x, this.y);
    }

};

Button.prototype.isMouseInside = function(mouseX, mouseY) {
    return (mouseX > (this.x - (this.width / 2)) &&
           mouseX < (this.x + (this.width / 2)) &&
           mouseY > (this.y - (this.height / 2)) &&
           mouseY < (this.y + (this.height / 2)));
};

Button.prototype.handleMouseClick = function(mouseX, mouseY) {
    if (this.isMouseInside(mouseX, mouseY)) {
        this.onClick();
    }
};

Button.prototype.handleMouseHover = function(mouseX, mouseY) {
    this.hover = this.isMouseInside(mouseX, mouseY);
};
*/

//Button class
class Button{
    constructor(config){
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 150;
        this.height = config.height || 50;
        this.label = config.label || "Click me!";
        this.onClick = config.onClick || function() {};
        this.hover = 0;

        this.pressed = false;
    }

    draw(ctx){
        ctx.font=this.height / 2 + "px dialogFont";

        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        //Normal button
        if (!this.hover){

            ctx.fillStyle = "black";
            ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
            ctx.fillStyle = "blue";
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        } else {
            //Hovered over button
            ctx.fillStyle = "white";

            ctx.fillStyle = "blue";
            ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
            ctx.fillStyle = "white";
        }

        ctx.fillText(this.label, this.x, this.y + (this.height / 4));
    }

    isMouseInside(mouseX, mouseY) {
        return (mouseX > (this.x - (this.width / 2)) &&
               mouseX < (this.x + (this.width / 2)) &&
               mouseY > (this.y - (this.height / 2)) &&
               mouseY < (this.y + (this.height / 2)));
    };

    handleMouseClick(mouseX, mouseY) {
        if (this.isMouseInside(mouseX, mouseY)) {
            this.pressed = true;
            this.onClick();
        }
    };

    handleMouseUp(mouseX, mouseY) {
        if (this.isMouseInside(mouseX, mouseY)) {
            this.pressed = false;
        }
    };

    handleMouseHover(mouseX, mouseY) {
        this.hover = this.isMouseInside(mouseX, mouseY);
    }

}

class ColorButton extends Button {
    constructor(config){
        super(config);
        this.color = config.color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        if (this.hover){
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        }
    }
}

class IconButton extends Button {
    constructor(config){
        super(config);
        this.color = config.color;
        this.index = config.index;
    }
    draw(ctx){
        ctx.fillStyle = this.color;

        ctx.drawImage(colored_images[game_colors[current_color]][this.label],
                    this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);

        if (this.hover){
            ctx.fillStyle =  "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        }
    }
}

class Slider extends Button {
    constructor(config){
        super(config);
        this.range = 100;
        //this.color = config.color;
        this.tick_width = this.width / 10;
        this.pos = this.x - this.width / 2;
        this.down = 0;
    }


    handleMouseClick(mouseX, mouseY) {
        if (this.isMouseInside(mouseX, mouseY)) {
            this.pos = mouseX;
            this.down = 1;
        }
    };

    handleMouseHover(mouseX, mouseY) {
        this.hover = this.isMouseInside(mouseX, mouseY);
        if (this.isMouseInside(mouseX, mouseY) && this.down) {
            this.pos = mouseX;
        }
    };

    handleMouseUp(mouseX, mouseY) {
        this.down = 0;
    };

    draw(ctx){

        ctx.fillStyle = "black";
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, 3);
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, 5);

        //tick
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.pos - this.tick_width / 2, this.y - (this.height) , this.tick_width, this.height);
        ctx.lineWidth = 3;
        ctx.strokeRect(this.pos - this.tick_width / 2, this.y - (this.height), this.tick_width, this.height);

    }
}

export {Button, ColorButton, IconButton, Slider};
