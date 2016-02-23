(function(){

	var canvas,
	ctx,
	ctx2,
	width,
	height,
	frames=0,
	counter=0,

	//size=10,

	dir = {
		left:0,
		up:1,
		right:2,
		down:3
	},

	food,
	foodValue,

	tipY,
	tipX,

	currentstate,
	states = {
		Pause: 0,
		Play : 1,
		Dead: 2
	},

	snake = {
		size:0,
		length:0,
		score: 0,
		scoreCount:0,
		pos:[],
		dir: 0,
		speed:0,

		startTime:0,
		lastPoint:0,


		init : function(){
			this.size = 10;
			this.length =1;
			this.score =0;
			this.scoreCount=0;
			this.pos=[{x:100,y:100,d:dir.right},{x:90,y:100,d:dir.right}];
			this.dir = dir.right;
			this.speed = 10;

			this.startTime = new Date();
			this.lastPoint = this.startTime;

			food = null;
			foodValue = 10;
			
			tipY = height+100;

		},
		update : function(){
			var s = this;

			if(food === null){
				do{
					var foodSpawnOK = true, fx, fy;
					fx = Math.floor(Math.random()*width/this.size)*this.size;
					fy = Math.floor(Math.random()*height/this.size)*this.size;

					//console.log(foodSpawnOK+": "+fx+", "+fy);
					for(var i=0; i<this.length; i++){
						var sx = this.pos[i].x;
						var sy = this.pos[i].y;

						if(fx+this.size > sx && fx < sx+this.size && fy+this.size >sy && fy < sy+this.size){
						//if(fx+this.speed > sx && fx < sx+this.speed && fy+this.speed >sy && fy < sy+this.speed){
							foodSpawnOK = false;
							console.log("foodspawn crash, Try again");
							break;
						}
					}
				}while(!foodSpawnOK)

				food = {
					x: fx,
					y: fy,
					value: foodValue
				}
			}

			// update body
			var ax = this.pos[0].x;
			var ay = this.pos[0].y;

			var bx = this.pos[1].x;
			var by = this.pos[1].y;
			for(var i=1; bx !== undefined ; i++){
				
				this.pos[i].x = ax;
				this.pos[i].y = ay;

				ax = bx;
				ay = by;

				if(this.pos[i+1] === undefined)
					break;

				bx = this.pos[i+1].x;
				by = this.pos[i+1].y;


			}

			
			// update head
			switch(s.dir){
				case dir.left:
					if(s.pos[0].x <= 0)
						s.pos[0].x = width;
					s.pos[0].x -= this.speed;	
					//s.pos[0].x -= 10;	
					break;

				case dir.up:
					if(s.pos[0].y <= 0)
						s.pos[0].y = height;
					s.pos[0].y -=this.speed;
					// s.pos[0].y -=10;
					break;

				case dir.right:
					if(s.pos[0].x >= width)
						s.pos[0].x = -10;
					s.pos[0].x += this.speed;
					// s.pos[0].x += 10;
					break;

				case dir.down:
					if(s.pos[0].y >= height)
						s.pos[0].y = 0;
					s.pos[0].y += this.speed;
					// s.pos[0].y += 10;
					break;
			}

			// check collision
			var hx = this.pos[0].x;
			var hy = this.pos[0].y;
			for(var i=1; i<this.length; i++){
				var bx = this.pos[i].x;
				var by = this.pos[i].y;

				if(hx+this.speed > bx && hx < bx+this.speed && hy+this.speed >by && hy < by+this.speed){
					currentstate = states.Dead;
				}

			}

			// snake eat
			if(s.pos[0].x+this.size > food.x && s.pos[0].x < food.x + this.size && s.pos[0].y+this.size > food.y && s.pos[0].y < food.y+this.size){

				for(var i=0; i< food.value;i++){
					var _x = this.pos[this.length].x;
					var _y = this.pos[this.length++].y;
					s.pos.push({x:_x,y:_y});
				}

				snake.score += this.speed;
				this.lastPoint = new Date();
				tipY = height+100;
			
				food = null;
			}


		},
		draw : function(){
			if(food !== null){
				ctx.save();
				ctx.fillStyle="red";
				ctx.fillRect(food.x, food.y, this.size, this.size);
				ctx.restore();
			}

			for(var i=0; i<this.pos.length; i++){	
				var _x = this.pos[i].x;
				var _y = this.pos[i].y;
				
				if(i===0){
					ctx.save();
					ctx.fillStyle = "rgba(0,200,0,1)";
					ctx.fillRect(this.pos[i].x, this.pos[i].y,this.size,this.size);
					ctx.restore();

				}else
					ctx.fillRect(this.pos[i].x, this.pos[i].y,this.size,this.size);	
			}

			// Write score to screen
			ctx.save();
			ctx.fillStyle = "rgba(100,100,100,.2)";
			ctx.font = "bold 300px monospace";
			if(frames%3==0 && snake.scoreCount < snake.score)
				snake.scoreCount++;
			
			var strScore  = snake.scoreCount;
			var txtWidth = ctx.measureText(strScore).width;

			ctx.fillText(strScore,width/2-txtWidth/2,300);
			ctx.restore();

			// Write tips 
			if( new Date().getTime()-this.lastPoint.getTime() > 20*(6-this.speed/2)*1000){
				ctx.save();
				ctx.fillStyle = "rgba(000,100,200,.3)";
				ctx.font = "bold 20px monospace";
				var str1 = "For fort?";
				var str2  = "Endre fart med + / -";
	
				if(frames%2==0)
					tipY--;
				ctx.fillText(str1,width/2-txtWidth/2+3*Math.cos(frames/10),tipY-30);
				ctx.fillText(str2,width/2-txtWidth/2+3*Math.sin(frames/10),tipY);
				ctx.restore();
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
		currentstate = states.Play;
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
		if(currentstate === states.Play){
			snake.update();
		}

	}

	function render(){
		ctx.save();
		ctx.fillStyle ="#fff";
		ctx.fillRect(0,0,width, height);
		ctx.restore();
		snake.draw();



		if(currentstate === states.Pause ){
			ctx.save();
			ctx.fillStyle = "rgba(0,0,255,.1)"
			ctx.fillRect(0,0,width, height);
			ctx.restore();

			ctx.save();
			ctx.font = "bold 40px monospace";
			ctx.fillStyle = "red";
			ctx.fillText("Trykk ENTER for å fortsette", 20+Math.sin(frames/10), 100);
			ctx.restore();

			


		}
		else if(currentstate === states.Dead ){
			ctx.save();
			ctx.fillStyle = "rgba(255,0,0,.3)"
			ctx.fillRect(0,0,width, height);
			ctx.restore();

			ctx.save();
			ctx.font = "bold 70px monospace";
			ctx.fillStyle = "blue";
			ctx.fillText("PANG!", 110+Math.sin(frames/10), 150);
			ctx.font = "bold 22px monospace";
			ctx.fillText("Trykk ENTER for å prøve igjen", 60+Math.sin(frames/10), 250);
			ctx.restore();

			var x = snake.pos[0].x, y = snake.pos[0].y;
			drawStar(x+5,y+5,5,30,10);
		}		
	}

	function onKeydown(e){
		var k = e.which;
		console.log(k);
		switch(k){
			case 13: // ENTER
				if(currentstate === states.Pause)
					currentstate = states.Play;
				else if(currentstate === states.Play)
					currentstate = states.Pause;
				else if(currentstate === states.Dead){
					snake.init();
					currentstate = states.Play;

				}
				break;
			case 37: 	// LEFT
				if(snake.dir !== dir.right)
					snake.dir = dir.left;
				break;
			case 38: 	// UP
				if(snake.dir !== dir.down)
					snake.dir = dir.up;
				break;
			case 39: 	// RIGHT
				if(snake.dir !== dir.left)
					snake.dir = dir.right;
				break;
			case 40: 	// DOWN
				if(snake.dir !== dir.up)
					snake.dir = dir.down;
				break;
			case 107: // PLUS
				snake.speed += snake.speed < 10 ? 1:0;
				break; 
			case 187: // PLUS
				snake.speed += snake.speed < 10 ? 1:0;
				break; 
			case 109: // MINUS
				snake.speed -= snake.speed > 1 ? 1:0;
				break;
			case 189: // MINUS
				snake.speed -= snake.speed > 1 ? 1:0;
				break;
		}
	}

	function drawStar(cx,cy,spikes,outerRadius,innerRadius){
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;

      ctx.save();
      ctx.strokeStyle="#0ff";
      ctx.strokeStyle="rgba(255,0,0,1)";
      ctx.fillStyle="rgba(255,0,0,.6)";
      ctx.beginPath();
      ctx.moveTo(cx,cy-outerRadius)
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(cx,cy-outerRadius)
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

	main();
})();
