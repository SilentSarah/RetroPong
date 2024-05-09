"use strict"

function mkGradient(canvas, sx, sy, ex, ey, sc, mc, ec)
{
	const grad = canvas.ctx.createLinearGradient(sx, sy, ex, ey);
	grad.addColorStop(0, sc);
	grad.addColorStop(.5, mc);
	grad.addColorStop(1, ec);
	return (grad);
}

// draw a rectangle
function drawRect(canvas, x, y, w, h, color)
{
    canvas.ctx.fillStyle = color;
    canvas.ctx.fillRect(x, y, w, h);
}

function setShadow(canvas)
{
	canvas.ctx.shadowColor = '#0005'; // Shadow color with alpha (transparency)
	canvas.ctx.shadowBlur = canvas.el.height / 75; // Blur radius of the shadow
	canvas.ctx.shadowOffsetY = canvas.el.height / 75;
}

function clearShadow(canvas)
{
	canvas.ctx.shadowBlur = 0;
	canvas.ctx.shadowColor = 'transparent';
	canvas.ctx.shadowOffsetY = 0;
}

