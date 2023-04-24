/**
    This file contains all the common 2D collision algorithms, including some
    more exotic ones like point-to-polygon collision
**/

export class Rectangle {
    constructor(topLeft_x, topLeft_y, w, h){
        this.x = topLeft_x;
        this.y = topLeft_y;
        this.w = w;
        this.h = h;
    }
}

export function pointvcircle(pt, center, radius){
    return pt.subtract(center).modulus() <= radius;
}


export function circlevcircle(center1, radius1, center2, radius2){
    return center1.subtract(center2).modulus() <= radius1 + radius2;
}

export function circlevaabb(center, radius, topleft, width, height){

    return center1.subtract(center2).modulus() <= radius1 + radius2;
}

export function aabbvaabb(topleft1, size1, topleft2, size2){

    var collisionX = topleft1.x + size1.x >= topleft2.x && topleft2.x + size2.x >= topleft1.x;
    var collisionY = topleft1.y + size1.y >= topleft2.y && topleft2.y + size2.y >= topleft1.y;
    return collisionX && collisionY;
}

//Checks for collision between 2 Rectangle objects
export function rectvrect(rect1, rect2){

    var collisionX = rect1.x + rect1.w >= rect2.x && rect2.x + rect2.w >= rect1.x;
    var collisionY = rect1.y + rect1.h >= rect2.y && rect2.y + rect2.h >= rect1.y;
    return collisionX && collisionY;
}

//Line segment against line segment
export function linevline(x1, y1, x2, y2, x3, y3, x4, y4){
    // calculate the distance to intersection point
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    //var uA = ((e2.x - s2.x)*(s1.y - s2.y) - (e2.y - s2.y)*(s1.x - s2.x)) / ((e2.y - s2.y)*(e1.x - s1.x) - (e2.x - s2.x)*(e1.y - s1.y));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    //var uB = ((e1.x - s1.x)*(s1.y - s2.y) - (e1.y - s1.y)*(s1.x - s2.x)) / ((e2.y - s2.y)*(e1.x - s1.x) - (e2.x - s2.x)*(e1.y - s1.y));


    // if uA and uB are between 0-1, lines are colliding
    //if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

        // optionally, draw a circle where the lines meet
        /*
        var intersectionX = x1 + (uA * (x2-x1));
        var intersectionY = y1 + (uA * (y2-y1));
        */

        //return true;
    //}
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

//Start is the starting point, delta is the direction of the trajectory
export function lsvsaabb(start, end, rect){
    var left = linevline(start.x, start.y, end.x, end.y, rect.x, rect.y, rect.x, rect.y + rect.h);
    if (left) return true;
    var right = linevline(start.x, start.y, end.x, end.y, rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h);
    if (right) return true;
    var top = linevline(start.x, start.y, end.x, end.y, rect.x, rect.y, rect.x + rect.w, rect.y);
    if (top) return true;
    var bottom = linevline(start.x, start.y, end.x, end.y, rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h);
    return bottom;
}


//var temp = new Vector2D(0, 0);
export function GetIntersection(fDst1, fDst2, p1, p2, hit) {
    if ( (fDst1 * fDst2) >= 0.0) return 0;
    if ( fDst1 == fDst2) return 0;
    var temp = p1.add( p2.subtract(p1).scalarMult( -fDst1/(fDst2-fDst1) ));
    hit.x = temp.x;
    hit.y = temp.y;
    //console.log(hit);
    return 1;
}

export function inaabb(pos, x, y, w, h){
    return (pos.y >= y && pos.y <= y + h) && (pos.x >= x && pos.x <= x + w);
}

export function InBox( hit, topleft, bottomright, axis) {
    if ( axis==1 && hit.y >= topleft.y && hit.y <= bottomright.y) return 1;
    if ( axis==2 && hit.x >= topleft.x && hit.x <= bottomright.x) return 1;
    if ( axis==3 && hit.x > topleft.x && hit.x < bottomright.x && hit.y > topleft.y && hit.y < bottomright.y) return 1;
    return 0;
}

export function linevaabb(topleft, size, start, end, hit){
    //debugger;
    var bottomright = topleft.add(size);
    if (end.x < topleft.x && start.x < topleft.x) return false;
    if (end.x > bottomright.x && start.x > bottomright.x) return false;
    if (end.y < topleft.y && start.y < topleft.y) return false;
    if (end.y > bottomright.y && start.y > bottomright.y) return false;
    if (start.x > topleft.x && start.x < bottomright.x &&
        start.y > topleft.y && start.y < bottomright.y)
    {
      hit.x = start.x;
      hit.y = start.y;
      return true;
    }
    if ( (GetIntersection( start.x-topleft.x, end.x-topleft.x, start, end, hit) && InBox( hit, topleft, bottomright, 1 ))
      || (GetIntersection( start.y-topleft.y, end.y-topleft.y, start, end, hit) && InBox( hit, topleft, bottomright, 2 ))
      || (GetIntersection( start.x-bottomright.x, end.x-bottomright.x, start, end, hit) && InBox( hit, topleft, bottomright, 1 ))
      || (GetIntersection( start.y-bottomright.y, end.y-bottomright.y, start, end, hit) && InBox( hit, topleft, bottomright, 2 )) )
    	return true;

    return false;
}

export function linevcircle(center, radius, start, end){
    //Calc dist from center to line segment, true if dist <= radius
    var denom = end.subtract(start).modulus();
    var dist = Math.abs((end.x - start.x) * (start.y - center.y) - (start.x - center.x) * (end.y - start.y));
    return (denom / dist) <= radius;
}

export function linevellipse(center, size, start, end, d=5){
    //SHift the center to zero first
    var start_sh = start.subtract(center);
    var end_sh = end.subtract(center);

    //Equation of ellipse x^2/d^2 + y^2 = size^2, x coordinate is dilated d times
    if (end_sh.x - start_sh.x == 0){
        //Vertical line segment
        if (Math.abs(end_sh.x / d) > size) return false; //Not touching ellipse
        var rhs = Math.sqrt((size - end.x/d) * (size + end_sh.x/d)); // == y^2
        var lower_y = Math.min(start_sh.y, end_sh.y);
        var upper_y = Math.max(start_sh.y, end_sh.y);

        if (rhs >= lower_y && rhs <= upper_y) return true;
        return false;
    }
    var M = (end_sh.y - start_sh.y) / (end_sh.x - start_sh.x);
    var a = M**2 + (1 / d**2);
    var b = -2 * M * (start_sh.x * M + start_sh.y);
    var c = (M * start_sh.x - start_sh.y)**2 - size **2;

    //Solve quadratic equation with coefficients a, b, c
    var discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) return false; //No real solutions

    var x_plus = (-b + Math.sqrt(discriminant)) / (2 * a);
    var x_minus = (-b - Math.sqrt(discriminant)) / (2 * a);

    var lower_x = Math.min(start_sh.x, end_sh.x);
    var upper_x = Math.max(start_sh.x, end_sh.x);

    var lower_y = Math.min(start_sh.y, end_sh.y);
    var upper_y = Math.max(start_sh.y, end_sh.y);

    if (x_plus >= lower_x && x_plus <= upper_x){
        return true;
    }

    if (x_minus >= lower_x && x_minus <= upper_x){
        return true;
    }

    return false;
}

//Check if point is inside polygon
export function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    //debugger;
    var x = point.x, y = point.y;

    var inside = false;
    for (var i = 0, j = vs.length - 2; i < vs.length; i+=2) {
        var xi = vs[i], yi = vs[i+1];
        var xj = vs[j], yj = vs[j+1];
        j=i;
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
