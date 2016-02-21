(function(){

	var canvas,
	ctx,
	ctx2,
	width,
	height,
	frames=0,

	size=10,

	dir = {
		left:0,
		up:1,
		right:2,
		down:3
	},

	food,

	snake = {
		length:0,
		pos:[],
		dir: 0,



		init : function(){
			this.length =2;
			this.pos=[{x:100,y:100},{x:90,y:100},{x:80,y:100},{x:70,y:100}],
			this.dir = dir.right;
			food = null;

		},
		update : function(){
			var s = this;

			if(food === null){
				food = {
					x: Math.floor(Math.random()*width/size)*size,
					y: Math.floor(Math.random()*height/size)*size,
				}
			}

			// update body
			var ax = this.pos[0].x;
			var ay = this.pos[0].y;
			var bx = this.pos[1].x;
			var by = this.pos[1].y;
			for(var i=1; bx !== undefined ; i++){
				//console.log(this.pos[i].x);
				
				this.pos[i].x = ax;
				this.pos[i].y = ay;

				ax = bx;
				ay = by;

				if(this.pos[i+1] === undefined)
					break;

				bx = this.pos[i+1].x-9;
				by = this.pos[i+1].y;


			}

			
			// update head
			switch(s.dir){
				case dir.left:
					if(s.pos[0].x < 0)
						s.pos[0].x = width;
					s.pos[0].x -= 1;	
					break;

				case dir.up:
					if(s.pos[0].y < 0)
						s.pos[0].y = height;
					s.pos[0].y -=1;
					break;

				case dir.right:
					if(s.pos[0].x > width)
						s.pos[0].x = -10;
					s.pos[0].x += 1;
					break;

				case dir.down:
				if(s.pos[0].y > height)
						s.pos[0].y = -10;
					s.pos[0].y += 1;
					break;
				}
			


			
			
			// snake meets food
			if(s.pos[0].x+size > food.x && s.pos[0].x < food.x + size && s.pos[0].y+size > food.y && s.pos[0].y < food.y+size){


				var _x = this.pos[this.length].x;
				var _y = this.pos[this.length++].y;



				s.pos.push({x:_x,y:_y});
			
				food = null;
			}


		},
		draw : function(){
			if(food !== null){
				ctx.save();
				ctx.fillStyle="red";
				ctx.fillRect(food.x, food.y, 10, 10);
				ctx.restore();
			}

			for(var i=0; i<this.pos.length; i++){	
				var _x = this.pos[i].x;
				var _y = this.pos[i].y;
				//console.log(_x+", "+_y);
				ctx.fillRect(this.pos[i].x, this.pos[i].y,10,10);
				
			}

		}


	};

	function main(){

		canvas = document.createElement("canvas");
		
		ctx = canvas.getContext("2d");
	
		width= window.innerWidth;
		height = window.innerHeight;

		width = 600;
		height  = width / 1.5;

		canvas.width = width;
		canvas.height= height;

		canvas.style.border = "thin solid black";
		
		document.addEventListener("keydown", onKeydown);

		document.body.appendChild(canvas);


		run();

	}

	function run(){
		snake.init();

		var loop = function(){
			update();
			render();
			window.requestAnimationFrame(loop);
		}
		loop();
	}

	function update(){
		frames++;
		snake.update();

	}

	function render(){
		ctx.clearRect(0,0,width, height);
		snake.draw();
	}

	function onKeydown(e){
		var k = e.which;
		switch(k){
			case 37:
				snake.dir = dir.left;
				break;
			case 38:
				snake.dir = dir.up;
				break;
			case 39:
				snake.dir = dir.right;
				break;
			case 40:
				snake.dir = dir.down;
				break;
			case 13:
				var s= snake;
				console.log("snake: ("+s.pos[0].x+","+s.pos[0].y+")");
				console.log("size: "+size);
				for(var i=0; i< s.pos.length;i++){
					console.log(i+": "+s.pos[i].x+", "+s.pos[i].y);
				}
				break;
		}
	}

	main();
})();