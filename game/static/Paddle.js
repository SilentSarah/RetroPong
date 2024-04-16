"use strict"
import { mkGradient, setShadow, clearShadow } from "./misc.js";

export class Paddle
{
	setup(canvas, side, strokeGradColors)
	{
		this.width = 1 / 28; // width
		this.height = this.width * 2.5; // height
		this.radius = 1 / 80; // radius
		this.lineWidth = 1 / 400; // line width
		this.offset = 1 / 50;
		this.x = side == 'r' ? (1 - this.width) - (this.lineWidth + this.offset) : 0 + (this.lineWidth + this.offset);
		this.y = (1  - this.height) / 2;
		this.fillColor = '#000';
		this.strokeGradColors = strokeGradColors || this.strokeGradColors;
	}

	draw(canvas)
	{
		let drawX, drawY, drawW, drawH, drawR, drawLineWidth;

		drawX = this.x * canvas.el.width;
		drawY = this.y * canvas.el.height;
		drawW = this.width * canvas.el.width;
		drawH = this.height * canvas.el.height;
		drawR = this.radius * canvas.el.width;
		drawLineWidth = this.lineWidth * canvas.el.width;

		setShadow(canvas);
		canvas.ctx.lineJoin = 'round';
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(drawX + drawR, drawY);
		canvas.ctx.arcTo(drawX + drawW, drawY, drawX + drawW, drawY + drawH, drawR);
		canvas.ctx.arcTo(drawX + drawW, drawY + drawH, drawX, drawY + drawH, drawR);
		canvas.ctx.arcTo(drawX, drawY + drawH, drawX, drawY, drawR);
		canvas.ctx.arcTo(drawX, drawY, drawX + drawW, drawY, drawR);
		canvas.ctx.fillStyle = this.fillColor;
		canvas.ctx.strokeStyle = mkGradient(canvas, drawX, drawY, drawX, drawY + drawH, this.strokeGradColors[0], this.strokeGradColors[1]);
		canvas.ctx.lineWidth = drawLineWidth;
		canvas.ctx.fill();  // Fill the path with the specified color
		canvas.ctx.stroke();  // Stroke the path (border)
		canvas.ctx.closePath();
		// RESET
		clearShadow(canvas);
	}

}