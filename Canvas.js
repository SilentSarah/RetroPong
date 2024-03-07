"use strict"

import { mkGradient, drawRect, setShadow, clearShadow } from './misc.js';

export class Canvas
{
	state = {
		keyDown: ''
	}

	constructor (el)
	{
		this.el = el;
		this.ctx = el.getContext("2d");
		this.dpr = window.devicePixelRatio;
		this.updateStyle();
		this.setSizeAttrib();
		this.dprAdjust();
		this.el.focus();
		this.el.addEventListener("keydown", (e) => { e.preventDefault(); e.stopPropagation(); this.state.keyDown = e.key });
		this.el.addEventListener("keyup", (e) => { e.preventDefault(); e.stopPropagation(); this.state.keyDown = '' });
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

	getCanvasSize()
	{
		return ({
			width: this.el.getAttribute("width"),
			height: this.el.getAttribute("height")
		});
	}

	setup()
	{
		this.dprAdjust();
		this.ball = {
			x : this.el.width / 2,
			y : this.el.height / 2,
			r : this.el.width / 150,
			speed : 0.007 * this.el.width,
			velocityX : 0.007 * this.el.width,
			velocityY : 0.007 * this.el.width,
			color : "#eee"
		}
		// this Object, side, gradient colors
		this.user.setup( this, 'l', ['#feec63', '#ff0100'] );
		this.com.setup( this, 'r', ['#68ebff', '#013afe'] );
		this.resetBall();
	}

	// Scoring resets the ball
	resetBall()
	{
		this.ball.x = this.el.width /2;
		this.ball.y = this.el.height /2;
		this.ball.speed = 0.007 * this.el.width;
		this.ball.velocityX = this.ball.speed;
		this.ball.velocityY = this.ball.speed;
	}

	// draw the ball
	drawBall()
	{
		// console.log("ball from drawBall: ", this.ball);
		setShadow(this);
		this.ctx.fillStyle = this.ball.color;
		this.ctx.beginPath();
		this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.fill();
		clearShadow(this);
	}

	// draw the net
	drawNet()
	{
		setShadow(this);
		this.ctx.setLineDash([this.el.height / 7, this.el.height / 20]);//pattern
		// Set line color and width
		this.ctx.strokeStyle = '#fff7';
		this.ctx.lineWidth = this.el.width / 120;
		// Draw the dashed line
		this.ctx.beginPath();
		this.ctx.moveTo(this.el.width / 2, this.el.height / 20); // Starting point
		this.ctx.lineTo(this.el.width / 2, this.el.height); // Ending point
		this.ctx.stroke();
		this.ctx.setLineDash([]);
		clearShadow(this);
	}

	// collision detection
	collision(b, p)
	{
		p.top = p.y - p.lineWidth;
		p.bottom = p.y + p.height + p.lineWidth;
		p.left = p.x - p.lineWidth;
		p.right = p.x + p.width + p.lineWidth;
		
		b.top = b.y - b.r;
		b.bottom = b.y + b.r;
		b.left = b.x - b.r;
		b.right = b.x + b.r;
		
		return (
			p.left < b.right
			&& p.top < b.bottom
			&& p.right > b.left
			&& p.bottom > b.top
		);
	}

	checkScore()
	{
		// change the score of players, if the ball goes to the left "canvas.ball.x<0" computer win, else if "canvas.ball.x > canvas.el.width " the user win
		if( this.ball.x - this.ball.r < 0 )
			this.com.score++;
		else if( this.ball.x + this.ball.r > this.el.width )
			this.user.score++;
		else return ;
		this.resetBall();
	}

	moveCom()
	{
		// computer plays for itself, and we must be able to beat it
		// simple AI
		const increment = ((this.ball.y - (this.com.y + this.com.height/2))) * this.dpr * 0.1;
		if (increment + this.com.y < 0
			|| (increment + this.com.y) + (this.com.height + this.com.lineWidth) > this.el.height)
			this.com.y += 0;
		else
			this.com.y += increment;
	}

	checkWallCollision()
	{
		// when the ball collides with bottom and top walls we inverse the y velocity.
		if(this.ball.y - this.ball.r <= 0 || this.ball.y + this.ball.r >= this.el.height )
		{
			this.ball.velocityY = -this.ball.velocityY;
			if (this.ball.y - this.ball.r <= 0)
				this.ball.y = Math.max(this.ball.y, this.ball.r); // Prevent going below zero
			else
				this.ball.y = Math.min(this.ball.y, this.el.height - this.ball.r);
		}
	}

	checkPaddleCollision()
	{
		// we check if the paddle hit the user or the com paddle
		const player = (this.ball.x + this.ball.r < this.el.width / 2) ? this.user : this.com;
    
		// if the ball hits a paddle
		if(this.collision(this.ball, player)){
		// we check where the ball hits the paddle
			let collidePoint = (this.ball.y - (player.y + player.height/2));
			// normalize the value of collidePoint, we need to get numbers between -1 and 1.
			// -player.height/2 < collide Point < player.height/2
			collidePoint = collidePoint / (player.height/2);
			
			// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
			// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
			// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
			// Math.PI/4 = 45degrees
			const angleRad = (Math.PI/4) * collidePoint;
			
			// change the X and Y velocity direction
			const direction = (this.ball.x + this.ball.r < this.el.width /2) ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
			
			// speed up the ball everytime a paddle hits it.
			this.ball.speed += this.ball.speed * 0.1;
		}
	}

	clear()
	{
		drawRect(this, 0, 0, this.el.width , this.el.height ,
		mkGradient(this, 0, 0, 0, this.el.height , '#262f81', '#c773ca'));
		// draw the net
		this.drawNet();
	}
}
