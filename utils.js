// Useful helper functions and data structures for the game


//Button class
var Button = function(config) {
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

function resize() {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    overlay.width = window.innerWidth / 2;
    overlay.height = window.innerHeight;
};
