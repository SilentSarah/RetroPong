"use strict"

import { Canvas } from './Canvas.js';
import { Paddle } from './Paddle.js';

const canvas = new Canvas(document.getElementById("pong"));
canvas.user = new Paddle();
canvas.com = new Paddle();
canvas.setup();
window.addEventListener('resize', canvas.setup.bind(canvas));

// update function, the function that does all calculations
function update()
{
	canvas.checkScore();
    // the ball has a velocity
    canvas.ball.x += canvas.ball.velocityX;
    canvas.ball.y += canvas.ball.velocityY;
	canvas.moveCom();
	canvas.checkWallCollision();
	canvas.checkPaddleCollision();
    
}

// render function, the function that does all the drawing
function render(){
	// clear the canvas
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