export class Cursor {
    constructor(ctx, x, y, radius = 10){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(){
        var length = this.radius * 3;
        //Circle
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();

        //The cross through the circle
        this.ctx.beginPath();
        this.ctx.moveTo(this.x - length / 2, this.y);
        this.ctx.lineTo(this.x + length / 2, this.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y - length / 2);
        this.ctx.lineTo(this.x, this.y + length / 2);
        this.ctx.stroke();
    }
}
