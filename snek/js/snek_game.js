function Game(width, height, snekSize){
	this.gameover = false;
	
	this.score = [];
	this.sneks = [];
	this.fruits = [];
	
	this.snekSize = snekSize;
	this.width = width;
	this.height = height;
	
	this.addSnek("red", 100, 100, 20, "Right");
	this.addSnek("blue", 100, 500, 20, "Right");
	this.spawnFruit();
}

Game.prototype.addSnek = function(color, x, y, size, direction){
	this.sneks.push(new Snek(color, x, y, size, direction));
	this.score.push(0);
	
	var id = "score"+this.sneks.length;
	var div = document.createElement(id);
	div.setAttribute("id", id)
	div.setAttribute("class", "score");
	div.style.top = (25+(this.sneks.length-1)*25)+"px";
	div.innerHTML = color+"'s Score: 0";
		
	document.body.appendChild(div);
}

Game.prototype.spawnFruit = function(){
	var gridWidth = 0;
	var gridHeight = 0;

	gridWidth = this.width/this.snekSize;
	gridHeight = this.height/this.snekSize;

	randx = Math.floor(Math.random() * gridWidth);
	randy = Math.floor(Math.random() * gridHeight);

	this.fruits[0] = new Fruit(this.snekSize*randx+1, this.snekSize*randy+1, 18, "green");
}

Game.prototype.update = function(){
	for(var i = 0; i < this.sneks.length; i++){
		var snek = this.sneks[i];
		snek.canTurn = true;
		snek.move();
		
		// Collision with fruits
		for(var j = 0; j < this.fruits.length; j++){
			var fruit = this.fruits[j];
			if(snek.collides(fruit)){
				this.score[i] += 100;
				this.updateScore(this.score[i], i);
				snek.grow();
				delete this.fruits[0];
				this.spawnFruit();
				break;
			}
		}

		// Collision with self
		aux = snek.head.follower;
		while(typeof(aux) != "undefined"){
			var x = snek.head.x;
			var y = snek.head.y;
			if(x == aux.x && y == aux.y){
				aux.follower = undefined;
				this.score[i] = Math.floor(this.score[i]/2);
				this.updateScore(this.score[i], i);
				break;
			}
			aux = aux.follower;
		}
		
		// Collision with others
		for(var j = 0; j < this.sneks.length; j++){
			var snek2 = this.sneks[j];
			if(snek2 !== snek){
				if(snek.head.x == snek2.head.x && snek.head.y == snek2.head.y){
					this.gameover = true;
				}
				aux = snek2.head.follower;
				while(typeof(aux) != "undefined"){
					var x = snek.head.x;
					var y = snek.head.y;
					if(x == aux.x && y == aux.y){
						aux.follower = undefined;
						this.score[j] = Math.floor(this.score[j]/2);
						this.updateScore(this.score[j], j);
						break;
					}
					aux = aux.follower;
				}
			}
		}

		// Collision with screen bounds
		var x = snek.head.x;
		var y = snek.head.y;
		if(x > this.width || x < 0 || y > this.height || y < 0){
			this.score[i] = Math.floor(this.score[i]/4);
			this.gameover = true;
		}
	}
}

Game.prototype.updateScore = function(score, index){
	document.getElementById("score"+(index+1)).innerHTML = "Score: " + score;
}


canvas = document.getElementById("canvas");
console.log(canvas)
context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

(function(){
	var game = new Game(canvas.width, canvas.height, 20);
	
    function keyDown(e){
		var snake1 = game.sneks[0];
        switch(e.keyCode){
        case 37: //Left
        	snake1.turn("Left");
			break;
        case 38: //Up
			snake1.turn("Up");
			break;
        case 39: //Right
            snake1.turn("Right");
            break;
        case 40: //Down
            snake1.turn("Down");
            break;
        }
		
		if(game.sneks.length > 1){
			var snake2 = game.sneks[1];
			switch(e.keyCode){
			case 65: //A
				snake2.turn("Left");
				break;
			case 87: //W
				snake2.turn("Up");
				break;
			case 68: //D
				snake2.turn("Right");
				break;
			case 83: //S
				snake2.turn("Down");
				break;
			}
		}
    }  

    document.addEventListener('keydown', keyDown, false);

	
	
	var render = function(){
		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < game.sneks.length; i++){
			game.sneks[i].draw();
		}
		
		for(var i = 0; i < game.fruits.length; i++){
			var fruit = game.fruits[i];
			context.fillStyle = fruit.color;
			context.fillRect(fruit.x, fruit.y, fruit.width, fruit.width);
		}
	}

    setInterval(
        function(){
			if(game.gameover){
				for(var i = 0; i < game.sneks.length; i++){
					document.getElementById("score"+(i+1)).innerHTML = "Game Over. "+game.sneks[i].color+"'s Score: " + game.score[i];
				}				
				return;
			}
			game.update();
			render();
        }, 100
    )
})();