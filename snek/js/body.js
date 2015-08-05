function Body(x, y, width, direction){
    this.x = x;
    this.y = y;
    this.width = width;
    this.direction = direction;
	this.nextDirection = direction;
}   

Body.prototype.addFollower = function(){
	var newx = this.x;
	var newy = this.y;
	if (typeof(this.follower) == "undefined" && this.follower == null) {
		switch(this.direction){
			case "Up":
				newy += this.width;
				break;
			case "Down":
				newy -= this.width;
				break;
			case "Left":
				newx += this.width;
				break;
			case "Right":
				newx -= this.width;
				break;
		}
		this.follower = new Body(newx, newy, this.width, this.direction);
	}else{
		this.follower.addFollower();
	}
}

Body.prototype.move = function(){
	switch(this.direction){
		case "Up":
			this.y -= this.width;
			break;
		case "Down":
			this.y += this.width;
			break;
		case "Left":
			this.x -= this.width;
			break;
		case "Right":
			this.x += this.width;
			break;
	}
	if(typeof(this.follower) == "undefined" && this.follower == null){
		return
	}
	this.follower.move();
	this.follower.turn(this.direction);
}

Body.prototype.turn = function(direction){
	if(this.direction == "Left" && direction == "Right" ||
	  this.direction == "Right" && direction == "Left" ||
	  this.direction == "Up" && direction == "Down" ||
	  this.direction == "Down" && direction == "Up"){
		return;
	}
	this.direction = direction;
}