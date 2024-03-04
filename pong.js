class Canvas
{
	constructor (el)
	{
		this.el = el;
		this.ctx = el.getContext("2d");
		this.dpr = window.devicePixelRatio;
		this.updateStyle();
		this.setSizeAttrib();
	}

	setSizeAttrib()
	{
		this.el.setAttribute("width", this.style.width * this.dpr);
		this.el.setAttribute("height", this.style.height * this.dpr);
	}

	updateStyle()
	{
		this.style = {
			width: +getComputedStyle(this.el).getPropertyValue("width").slice(0, -2),
			height: +getComputedStyle(this.el).getPropertyValue("height").slice(0, -2)
		}
	}

	dprAdjust()
	{
		this.updateStyle();
		this.setSizeAttrib();
	}
}

const canvas = new Canvas(document.getElementById("pong"));

function	mkGradient(sx, sy, ex, ey, sc, ec) {
	const grad = canvas.ctx.createLinearGradient(sx, sy, ex, ey);
	grad.addColorStop(0, sc);
	grad.addColorStop(1, ec);
	return (grad);
}

class Paddle
{
	boundingRect = canvas.el.getBoundingClientRect();;

	constructor (side, width, height, radius, fillColor, gradColors, lineWidth)
	{
		this.side = side;
		this.y = (canvas.el.height  - height) / 2;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.fillColor = fillColor;
		this.gradColors = gradColors;
		this.lineWidth = lineWidth;
	}

	draw()
	{
		canvas.ctx.lineJoin = 'round';
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(this.getSideX() + this.radius, this.y);
		canvas.ctx.arcTo(this.getSideX() + this.width, this.y, this.getSideX() + this.width, this.y + this.height, this.radius);
		canvas.ctx.arcTo(this.getSideX() + this.width, this.y + this.height, this.getSideX(), this.y + this.height, this.radius);
		canvas.ctx.arcTo(this.getSideX(), this.y + this.height, this.getSideX(), this.y, this.radius);
		canvas.ctx.arcTo(this.getSideX(), this.y, this.getSideX() + this.width, this.y, this.radius);
		canvas.ctx.fillStyle = this.fillColor;
		canvas.ctx.strokeStyle = mkGradient(this.getSideX(), this.y, this.getSideX(), this.y + this.height, this.gradColors[0], this.gradColors[1]);
		canvas.ctx.lineWidth = this.lineWidth;
		canvas.ctx.fill();  // Fill the path with the specified color
		canvas.ctx.stroke();  // Stroke the path (border)
		canvas.ctx.closePath();
	}

	getSideX()
	{
		return (this.side == "left" ? 0 + this.lineWidth + 10 : canvas.el.width - this.width - this.lineWidth * 2 - /* To make this variable later --> */ 10 );
	}

	move(mouseEvent)
	{
		if (this.boundingRect)
		{
			const newPos = (mouseEvent.clientY * canvas.dpr - this.height / 2) - this.boundingRect.top;
			this.y = (newPos < 0)
						? 0 // block paddle at top
						: newPos + (this.height + this.lineWidth) > canvas.el.height 
							? canvas.el.height  - (this.height + this.lineWidth) // block paddle at bottom
							: newPos;
		}
	}
}

// Ball object
const ball = {
    x : canvas.el.width /2,
    y : canvas.el.height /2,
    radius : 10,
    speed : 7,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

const user = new Paddle(
	'left', // side
	50, // width
	75, // height
	10, // radius
	'BLACK', // fill
	['#feec63', '#ff0100'], // stroke
	5
);

window.addEventListener("mousemove", user.move.bind(user));

const com = new Paddle(
	'right', // side
	50,
	75,
	10,
	'BLACK',
	['#68eafe', '#0039fe'],
	5
);

// NET
const net = {
    height : 10,
    width : 2,
    color : "WHITE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    canvas.ctx.fillStyle = color;
    canvas.ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    canvas.ctx.fillStyle = color;
    canvas.ctx.beginPath();
    canvas.ctx.arc(x,y,r,0,Math.PI*2,true);
    canvas.ctx.closePath();
    canvas.ctx.fill();
}

function ft_bound(val)
{
	return val + user.height > canvas.el.height 
		?	canvas.el.height  - user.height
		:	val < 0 ? 0 : val;
}

// listening to the mouse
window.addEventListener("mousemove", user.move);

// when COM or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.el.width /2;
    ball.y = canvas.el.height /2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.el.height ; i+=canvas.el.height /10){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// collision detection
function collision(b, p){
    p.top = p.y - p.lineWidth;
    p.bottom = p.y + p.height + p.lineWidth;
    p.left = p.getSideX() - p.lineWidth;
    p.right = p.getSideX() + p.width + p.lineWidth;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.el.width " the user win
    if( ball.x - ball.radius < 0 ){
        com.score++;
        // comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.el.width ){
        user.score++;
        // userScore.play();
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
	const increment = ((ball.y - (com.y + com.height/2))) * canvas.dpr * 0.1;
	com.y += (increment + com.y < 0)
						? 0 // block paddle at top
						: (increment + com.y) + (com.height + com.lineWidth) > canvas.el.height 
							? 0 // block paddle at bottom
							: increment;

    
    // when the ball collides with bottom and top walls we inverse the y velocity.
	if(ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.el.height ){
        ball.velocityY = -ball.velocityY;
		if (ball.y - ball.radius <= 0)
			ball.y = Math.max(ball.y, ball.radius); // Prevent going below zero
		else
			ball.y = Math.min(ball.y, canvas.el.height - ball.radius);
        // wall.play();
    }
    
    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.el.width /2) ? user : com;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        // hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.el.width /2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render(){
    
	/**********TEST */
	// ctx.shadowBlur = 1;
    // ctx.shadowColor = 'rgba(255, 0, 0, 1)';
    // ctx.shadowOffsetX = 5;
    // ctx.shadowOffsetY = 5;
	/**********TEST */

    // clear the canvas
	// console.log("canvas.el.width , canvas.el.height : ", canvas.el.width , canvas.el.height );
	// const temp = document.getElementById('pong');
	// console.log("temp.width, temp.height: ", +getComputedStyle(temp).getPropertyValue("width").slice(0, -2), +getComputedStyle(temp).getPropertyValue("height").slice(0, -2));
    drawRect(0, 0, canvas.el.width , canvas.el.height ,
		mkGradient(0, 0, 0, canvas.el.height , '#262f81', '#c773ca'));
    
    // draw the net
    drawNet();
    
    // draw the user's paddle
	// Test
	user.draw();
	// drawRoundedRect(user.x + 5, user.y, user.width, user.height, 10, user.color);
    // Test End
	// drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the COM's paddle
	com.draw();
	// drawRoundedRect(com.x - user.width - 5, com.y, user.width, user.height, 10, com.color);
    // drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);

}

function game(){
	canvas.dprAdjust();
	update();
    render();
	requestAnimationFrame(game);
}

game();