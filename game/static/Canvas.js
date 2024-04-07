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
		// this.resetBall();
	}

	// draw the ball
	drawBall()
	{
		// console.log("ball from drawBall: ", this.ball);
		// setShadow(this);
		this.ctx.fillStyle = this.ball.color;
		this.ctx.beginPath();
		// console.log(">>>>>>>>>>>this.ball.x * this.el.width, this.ball.y * this.el.height,: ", this.ball.x * this.el.width, this.ball.y * this.el.height,)
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
		// clearShadow(this);
	}

	clear()
	{
		drawRect(this, 0, 0, this.el.width , this.el.height ,
		mkGradient(this, 0, 0, 0, this.el.height , '#262f81', '#c773ca'));
		// draw the net
		// this.drawNet();
	}
}
