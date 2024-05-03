"use strict"

import { mkGradient, drawRect, setShadow, clearShadow } from './misc.js';

// function drawRotated(context, canvas, image, degrees){
//     // save the unrotated context of the canvas so we can restore it later
//     // the alternative is to untranslate & unrotate after drawing
// 	context.save();

//     // move to the center of the canvas
//     context.translate(canvas.width/2,canvas.height/2);

//     // rotate the canvas to the specified degrees
//     context.rotate(degrees*Math.PI/180);

//     // draw the image
//     // since the context is rotated, the image will be rotated also
//     context.drawImage(image,-image.width/2,-image.width/2);

//     // we’re done with the rotating so restore the unrotated context
//     context.restore();
// }

export class Canvas
{
	state = {
		keyDown: '',
		counter: 0 //test
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
		// test start
		this.fireballSprites = [];
		this.fireballSprites.length = 5;
		for (let i = 0; i < this.fireballSprites.length; i++)
		{
			this.fireballSprites[i] = new Image();
			this.fireballSprites[i].src = `/static/sprites/${i}.png`
		}
		// test end
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
			x : 1 / 2,
			y : 1 / 2,
			r : 1 / 150,
			speed : 0.007 * 1,
			velocityX : 0.007 * 1,
			velocityY : 0.007 * 1,
			color : "#eee"
		}
		// this Object, side, gradient colors
		this.user.setup( this, 'l', ['#feec63', '#ff0100'] );
		this.com.setup( this, 'r', ['#68ebff', '#013afe'] );
	}

	// draw the ball
	drawBall()
	{
		setShadow(this);
		this.ctx.fillStyle = this.ball.color;
		this.ctx.beginPath();
		this.ctx.arc(
			this.ball.x * this.el.width,
			this.ball.y * this.el.height,
			this.ball.r * this.el.width,
			0,
			Math.PI*2,
			true
		);
		this.ctx.closePath();
		this.ctx.fill();
		clearShadow(this);
		// Add animation after
		// test start
		this.ctx.drawImage(
			this.fireballSprites[this.state.counter++ % 5],
			this.ball.x * this.el.width - 30/2,
			this.ball.y * this.el.height - 30/2, 30, 30
		);
		// test end
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

	clear()
	{
		drawRect(this, 0, 0, this.el.width , this.el.height ,
		mkGradient(this, 0, 0, 0, this.el.height , '#262f81', '#c773ca'));
		// draw the net
		this.drawNet();
	}
}
