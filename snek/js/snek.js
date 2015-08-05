function Snek(color, x, y, width, direction) {
    this.color = color;
	this.width = width;
	this.canTurn = true;
	
    this.head = new Body(x, y, width, direction);
}

Snek.prototype.grow = function() {
	this.head.addFollower(this.x, this.y, this.width, this.head.direction);
}
	
Snek.prototype.turn = function(direction){
	if(this.canTurn){
		this.head.turn(direction);
		this.canTurn = false;
	}
}

Snek.prototype.move = function(){
	this.head.move();	
}

Snek.prototype.draw = function(){
	var aux = this.head;
	
	while(typeof(aux) != "undefined"){
		part = aux.width*10/100;
		context.fillStyle = this.color;
		context.fillRect(aux.x+part,aux.y+part,aux.width-2*part,aux.width-2*part);
	    aux = aux.follower;
	}
}

Snek.prototype.collides = function(object){
	var x = this.head.x;
	var y = this.head.y;
	var x2 = x + this.head.width;
	var y2 = y + this.head.width;
	
	var ox = object.x;
	var oy = object.y;
	var ox2 = ox + object.width;
	var oy2 = oy + object.width;
	
	return (ox >= x && ox <= x2 && oy >= y && oy <= y2 ||
		    x >= ox && x <= ox2 && y >= oy && y <= oy2);
}