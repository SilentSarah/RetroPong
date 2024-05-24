"use strict"

class Canvas
{
	state = {
		keyDown: ''
	}

	constructor (el)
	{
		this.canvasColors = ['#262f81', '#c773ca', '#878387']
		this.el = el;
		this.ctx = el.getContext("2d");
		this.dpr = window.devicePixelRatio;
		this.updateStyle();
		this.setSizeAttrib();
		this.dprAdjust();
		// this.el.focus();
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
	}

	// draw the ball
	drawBall(x, y, r)
	{
		setShadow(this);
		this.ctx.fillStyle = '#fff';
		this.ctx.beginPath();
		this.ctx.arc(
			x * this.el.width,
			y * this.el.height,
			r * this.el.width,
			0,
			Math.PI*2,
			true
		);
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

	clear()
	{
		drawRect(this, 0, 0, this.el.width , this.el.height ,
		mkGradient(this, 0, 0, 0, this.el.height , ...this.canvasColors));
		// draw the net
		this.drawNet();
	}
}