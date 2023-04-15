/**
Object for doing calculations with 2D vectors
**/

export function Vector2D(x, y){
		this.x = x;
		this.y = y;
}

//Get the angle of a 2D unit vector
Vector2D.prototype.angle = function(){
		if (this.x == 0)
			return Math.asin(Math.abs(this.y) / this.y);
		else
			return Math.atan2(this.y, this.x);
}

Vector2D.prototype.copy = function(){
		return new Vector2D(this.x, this.y);
}

//Add vectors
Vector2D.prototype.add = function(w){
  return new Vector2D(this.x + w.x, this.y + w.y);
}

//Scalar multiply vectors
Vector2D.prototype.scalarMult = function(t){
  return new Vector2D(t * this.x, t * this.y);
}

//Scalar multiply vectors
Vector2D.prototype.elemMult = function(v){
  return new Vector2D(v.x * this.x, v.y * this.y);
}

Vector2D.prototype.subtract = function(w){
  return this.add(w.scalarMult(-1.0));
}

//Dot product with the vector w
Vector2D.prototype.dot = function(w){
  return (this.x * w.x) + (this.y * w.y);
}

//Project onto the vector w
Vector2D.prototype.project = function(w){
  return w.scalarMult(this.dot(w));
}

Vector2D.prototype.modulus = function(){
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
}
Vector2D.prototype.modulus_squared = function(){
	return (this.x * this.x) + (this.y * this.y);
}

Vector2D.prototype.normalize = function(){
	if (this.modulus() == 0) return new Vector2D(0, 0);
	return new Vector2D (this.x / this.modulus(), this.y / this.modulus());
}

//Mod both components by value
Vector2D.prototype.mod = function(val){
	return new Vector2D(mod(this.x, val), mod(this.y, val));
  //return new Vector2D(this.x % val, this.y % val);
}

//Add vectors
Vector2D.prototype.rotate = function(angle){
  return new Vector2D(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
}
