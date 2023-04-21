/**
Useful data strutures
**/

export function Queue(){
    this.data = new Array(0);
    this.len = 0;
}
Queue.prototype.isEmpty = function(){
    return (this.len == 0);
}
Queue.prototype.pop = function(){
    if (this.data.length > 0){
        this.len -= 1;
        return this.data.splice(0, 1)[0];
    }
    throw "Trying to pop an empty queue!"
}
Queue.prototype.enqueue = function(item){
    this.data.push(item);
    this.len += 1;
}
Queue.prototype.top = function(){
    if (this.len > 0){
        return this.data[0];
    }
    throw "Queue is empty!"
}

Queue.prototype.size = function(){
    return this.len;
}

/**
Useful helper functions and data structures for the game
**/

// Converts a #ffffff hex string into an [r,g,b] array
export var h2r = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

// Inverse of the above
export var r2h = function(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

//Clip value of x in the interval [a, b] inclusive
export function clip(x, a, b){
    return Math.max(Math.min(x, b), a);
}
