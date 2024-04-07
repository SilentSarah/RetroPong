"use strict"

import { Canvas } from './Canvas.js';
import { Paddle } from './Paddle.js';
import { gameSocket } from "./socket.js";

const canvas = new Canvas(document.getElementById("pong"));
canvas.user = new Paddle();
canvas.com = new Paddle();
canvas.setup();
window.addEventListener('resize', canvas.setup.bind(canvas));

// update function, the function that does all calculations
function update()
{
	// canvas.checkScore();
    // the ball has a velocity
    // canvas.ball.x += canvas.ball.velocityX;
    // canvas.ball.y += canvas.ball.velocityY;
	// canvas.moveCom();
	// canvas.checkWallCollision();
	// canvas.checkPaddleCollision();
    
}

// render function, the function that does all the drawing
function render(){
	// clear the canvas
	// console.log("ball(x, y): ", canvas.ball.x, canvas.ball.y)
	canvas.clear();
	// update and draw user's paddle
	// canvas.user.draw(canvas, 'player');
    // draw the COM's paddle
	// canvas.com.draw(canvas);
    // draw the ball
	canvas.drawBall();
}

// function game(){
// 	// update();
//     render();
// 	requestAnimationFrame(game);
// }

// game();

// Socket code below
gameSocket.onmessage = function(e) {
	console.log("Message arrived: ", Date.now());

	// const data = JSON.parse(e.data);

	// const {x, y} = data;
	// canvas.ball.x = x * canvas.el.width;
	// canvas.ball.y = y * canvas.el.height;
	// render();
	
	
	// console.log("The data is: ", data);
	/* if (data.type == "posY")
		canvas.moveCom(data.posY);
	// else  *///if (data.type == "log")
	// {
	// 	console.log(data.log);
	// 	data.meta && console.log(data.meta);
	// }
	// else if (data.type == "update")
	// {
	// 	const ball = data.ball;
	// 	canvas.ball.x = ball.x * canvas.el.width;
	// 	canvas.ball.y = ball.y * canvas.el.height;
	// 	render();
	// 	// console.log("ball(x, y): ", ball.x, ball.y);
	// }
	// else
	// 	console.log("New data arrived: ", data);
	// console.log("The data received is: ", data);
};