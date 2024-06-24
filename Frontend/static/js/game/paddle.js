"use strict"

function draw_paddle(canvas, props)
{
	let drawX, drawY, drawW, drawH, drawR, drawLineWidth, shadowColor;
	const { x, y, w, h, r, lineWidth, strokeColors, speedBoostSpan } = props;

	drawX = x * canvas.el.width;
	drawY = y * canvas.el.height;
	drawW = w * canvas.el.width;
	drawH = h * canvas.el.height;
	drawR = r * canvas.el.width;
	drawLineWidth = lineWidth * canvas.el.width;

	shadowColor = speedBoostSpan ? "#fff" : "#0005" ;
	setShadow(canvas, shadowColor);
	canvas.ctx.lineJoin = 'round';
	canvas.ctx.beginPath();
	canvas.ctx.moveTo(drawX + drawR, drawY);
	canvas.ctx.arcTo(drawX + drawW, drawY, drawX + drawW, drawY + drawH, drawR);
	canvas.ctx.arcTo(drawX + drawW, drawY + drawH, drawX, drawY + drawH, drawR);
	canvas.ctx.arcTo(drawX, drawY + drawH, drawX, drawY, drawR);
	canvas.ctx.arcTo(drawX, drawY, drawX + drawW, drawY, drawR);
	canvas.ctx.fillStyle = '#000';
	canvas.ctx.strokeStyle = mkGradient(canvas, drawX, drawY, drawX, drawY + drawH, strokeColors[0], strokeColors[1]);
	canvas.ctx.lineWidth = drawLineWidth;
	canvas.ctx.fill();  // Fill the path with the specified color
	canvas.ctx.stroke();  // Stroke the path (border)
	canvas.ctx.closePath();
	// RESET
	clearShadow(canvas);
}