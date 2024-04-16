"use strict"

export function	mkGradient(canvas, sx, sy, ex, ey, sc, ec)
{
	const grad = canvas.ctx.createLinearGradient(sx, sy, ex, ey);
	grad.addColorStop(0, sc);
	grad.addColorStop(1, ec);
	return (grad);
}

// draw a rectangle
export function drawRect(canvas, x, y, w, h, color)
{
    canvas.ctx.fillStyle = color;
    canvas.ctx.fillRect(x, y, w, h);
}

export function setShadow(canvas)
{
	canvas.ctx.shadowColor = '#0005'; // Shadow color with alpha (transparency)
	canvas.ctx.shadowBlur = canvas.el.height / 75; // Blur radius of the shadow
	canvas.ctx.shadowOffsetY = canvas.el.height / 75;
}

export function clearShadow(canvas)
{
	canvas.ctx.shadowBlur = 0;
	canvas.ctx.shadowColor = 'transparent';
	canvas.ctx.shadowOffsetY = 0;
}

