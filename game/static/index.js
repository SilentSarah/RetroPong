"use strict"

import { Canvas } from './Canvas.js';
import { Paddle } from './Paddle.js';
import { gameSocket } from "./socket.js";

const canvas = new Canvas(document.getElementById("pong"));
canvas.user = new Paddle();
canvas.com = new Paddle();
canvas.setup();
window.addEventListener('resize', canvas.setup.bind(canvas));

// this.el.addEventListener("keydown", (e) => { e.preventDefault(); e.stopPropagation(); this.state.keyDown = e.key });
// this.el.addEventListener("keyup", (e) => { e.preventDefault(); e.stopPropagation(); this.state.keyDown = '' });

canvas.el.addEventListener("keydown", (e) => {
	e.preventDefault(); e.stopPropagation();
	let direction;
	if (e.key == 'w')
		direction = 'up'
	else if (e.key == 's')
		direction = 'down'
	else
		return ;
	gameSocket.send(JSON.stringify({
		'type': 'move',
		'direction': direction
	}));
});
// canvas.el.addEventListener("keyup", (e) => {
// 	e.preventDefault(); e.stopPropagation(); this.state.keyDown = ''
// });

// update function, the function that does all calculations
function update()
{
	if (gameSocket.readyState == WebSocket.OPEN)
		gameSocket.send(JSON.stringify({
			'type': 'update'
		}));
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
	canvas.user.draw(canvas, 'player');
    // draw the COM's paddle
	canvas.com.draw(canvas);
    // draw the ball
	canvas.drawBall();
}

function game(){
	update();
    render();
	requestAnimationFrame(game);
}

game();

// Socket code below
gameSocket.onmessage = function(e) {
	// console.log("Message arrived: ", Date.now());

	const data = JSON.parse(e.data);

	const {type, x, y, p1X, p1Y, p2X, p2Y} = data;
	if (type == 'update')
	{
		canvas.ball.x = x;
		canvas.ball.y = y;
		canvas.user.x = p1X;
		canvas.user.y = p1Y;
		canvas.com.x = p2X;
		canvas.com.y = p2Y;
		// console.log("<<<<<<<<<<<<<< x, y, p1X, p1Y, p2X, p2Y: ", x, y, p1X, p1Y, p2X, p2Y);
	}

};