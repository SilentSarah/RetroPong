"use strict"

function mkGradient(canvas, sx, sy, ex, ey, ...colors)
{
	const grad = canvas.ctx.createLinearGradient(sx, sy, ex, ey);
	for (let i = 0; i < colors.length; i++)
		grad.addColorStop(i / (colors.length - 1), colors[i]);
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

function tester()
{
	alert("Hello world, I am working!!!");
}

function startMode(mode)
{
	document.getElementById('mainMenu').classList.toggle('hidden');
	document.getElementById('gameInfo').classList.toggle('hidden');
	gameSocket.send(JSON.stringify({ 'type': 'start', mode }));
}
