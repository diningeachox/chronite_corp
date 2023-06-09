/**
    Buttons used in the game, includes hover, click and enable/disable states
**/

class Button{
    constructor(config){
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 150;
        this.height = config.height || 50;
        this.label = config.label || "Click me!";
        this.onClick = config.onClick || function() {};
        this.hover = 0;
        this.enabled = true;

        this.pressed = false;
        this.visible = true;
    }

    draw(ctx){
        if (this.visible){
            ctx.font=this.height / 2 + "px dialogFont";

            ctx.textAlign = "center";
            ctx.lineWidth = 3;
            //Normal button
            if (this.enabled){
                if (!this.hover){

                    ctx.fillStyle = "black";
                    ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
                    ctx.fillStyle = "#89CFF0";
                    ctx.strokeStyle = "#89CFF0";
                    ctx.strokeRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
                } else {
                    //Hovered over button
                    ctx.fillStyle = "white";

                    ctx.fillStyle = "#89CFF0";
                    ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
                    ctx.fillStyle = "white";
                }
            } else {
                ctx.fillStyle = "gray";
                ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
                ctx.fillStyle = "white";
            }

            ctx.fillText(this.label, this.x, this.y + (this.height / 4));
        }
    }

    isMouseInside(mouseX, mouseY) {
        return (mouseX > (this.x - (this.width / 2)) &&
               mouseX < (this.x + (this.width / 2)) &&
               mouseY > (this.y - (this.height / 2)) &&
               mouseY < (this.y + (this.height / 2)));
    };

    handleMouseClick(mouseX, mouseY) {
        if (this.isMouseInside(mouseX, mouseY)) {
            if (this.visible && this.enabled){
                this.pressed = true;
                this.onClick();
            }
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

class ResourceButton extends Button {
    constructor(config){
        super(config);
        this.left_choice = "Hyperchronite";
        this.right_choice = "Infrachronite";
        this.state = 0; //0 - left, 1 - right
        this.visible = false;
    }

    handleMouseClick(mouseX, mouseY) {
        if (this.isMouseInside(mouseX, mouseY)) {
            if (this.visible && this.enabled){
                this.pressed = true;
                this.state = (this.state + 1) % 2;
                this.onClick();
                em.notify("resource", this.state);
            }
        }
    };

    draw(ctx){
        if (this.visible){
            ctx.font="15px dialogFont";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText(this.left_choice, this.x - (this.width / 2) - 10 * this.left_choice.length, this.y);
            ctx.fillText(this.right_choice, this.x + (this.width / 2) + 10, this.y);

            ctx.fillStyle = "gray";
            ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);

            if (!this.hover){
                ctx.fillStyle = "black";
                ctx.fillRect(this.x - (this.width / 2) + (this.width / 2) * this.state, this.y - (this.height / 2), this.width / 2, this.height);
                ctx.strokeStyle = "#89CFF0";
                ctx.strokeRect(this.x - (this.width / 2) + (this.width / 2) * this.state, this.y - (this.height / 2), this.width / 2, this.height);
            } else {
                ctx.strokeStyle = "black";
                ctx.fillStyle = "#89CFF0";
                ctx.fillRect(this.x - (this.width / 2) + (this.width / 2) * this.state, this.y - (this.height / 2), this.width / 2, this.height);
                ctx.strokeRect(this.x - (this.width / 2) + (this.width / 2) * this.state, this.y - (this.height / 2), this.width / 2, this.height);
            }
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

export {Button, ResourceButton, IconButton, Slider};
