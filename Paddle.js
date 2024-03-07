"use strict"
import { mkGradient, setShadow, clearShadow } from "./misc.js";

export class Paddle
{
	setup(canvas, side, strokeGradColors)
	{
		this.width = canvas.el.width / 28; // width
		this.height = this.width * 2.5; // height
		this.radius = canvas.el.width / 80; // radius
		this.lineWidth = canvas.el.width / 400; // line width
		this.offset = canvas.el.width / 50;
		this.x = side == 'r' ? (canvas.el.width - this.width) - (this.lineWidth + this.offset) : 0 + (this.lineWidth + this.offset);
		this.y = (canvas.el.height  - this.height) / 2;
		this.fillColor = '#000';
		this.strokeGradColors = strokeGradColors || this.strokeGradColors;
	}

	draw(canvas, user)
	{// test goes here
		setShadow(canvas);
		(user == 'player' && this.updatePaddlePos(canvas));
		canvas.ctx.lineJoin = 'round';
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(this.x + this.radius, this.y);
		canvas.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.radius);
		canvas.ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.radius);
		canvas.ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius);
		canvas.ctx.arcTo(this.x, this.y, this.x + this.width, this.y, this.radius);
		canvas.ctx.fillStyle = this.fillColor;
		canvas.ctx.strokeStyle = mkGradient(canvas, this.x, this.y, this.x, this.y + this.height, this.strokeGradColors[0], this.strokeGradColors[1]);
		canvas.ctx.lineWidth = this.lineWidth;
		canvas.ctx.fill();  // Fill the path with the specified color
		canvas.ctx.stroke();  // Stroke the path (border)
		canvas.ctx.closePath();
		// RESET
		clearShadow(canvas);
	}

	getStep(canvas)
	{
		return (canvas.el.height * 0.01);
	}

	updatePaddlePos(canvas)
	{
		if (canvas.state.keyDown == 'w' && this.y >= 0)
		{
			const newVal = this.y - this.lineWidth / 2 - this.getStep(canvas);
			if (newVal >= 0)
				this.y = newVal;
			else
				this.y = 0 + this.lineWidth / 2;
		}
		else if (canvas.state.keyDown == 's')
		{
			const newVal = this.y + this.lineWidth / 2 + this.getStep(canvas);
			if (newVal <= canvas.el.height - this.height)
				this.y = newVal;
			else
				this.y = canvas.el.height - this.height - this.lineWidth / 2;
		}
	}
}