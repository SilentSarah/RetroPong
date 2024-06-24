"use strict"

class Canvas
{
	constructor (el)
	{
		// this.state = {
		// 	oldBallX: 0,
		// 	oldBallY: 0,
		// 	oldXDirection: true, // forward
		// 	oldYDirection: true, // forward
		// }
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

	drawBarrier(barriers)
	{
		barriers.forEach((active, xFactor) => {
			if (!active) return ;

			setShadow(this, '#0005');
			// Set line color and width
			this.ctx.strokeStyle = '#07e7';
			this.ctx.lineWidth = this.el.width / 120;
			// Draw the barrera
			const offset = this.el.width / 100
			const x = offset + xFactor * (this.el.width - offset * 2)
			this.ctx.beginPath();
			this.ctx.moveTo(x, 0); // Starting point
			this.ctx.lineTo(x, this.el.height); // Ending point
			this.ctx.stroke();
			clearShadow(this);
		})
	}

	setup()
	{
		this.dprAdjust();
	}

	// ballHit(newX, newY)
	// {
	// 	let ballHit = false;
	// 	const newXDirection = newX - this.state.oldBallX >= 0;
	// 	const newYDirection = newY - this.state.oldBallY >= 0;
	// 	if (newXDirection != this.state.oldXDirection
	// 		|| newYDirection != this.state.oldYDirection)
	// 		ballHit = true;
	// 	this.state.oldBallX = newX;
	// 	this.state.oldBallY = newY;
	// 	this.state.oldXDirection = newXDirection;
	// 	this.state.oldYDirection = newYDirection;
	// 	return (ballHit);
	// }

	// draw the ball
	drawBall(x, y, r, c)
	{
		setShadow(this, '#0005');
		this.ctx.fillStyle = c;
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
		setShadow(this, '#0005');
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