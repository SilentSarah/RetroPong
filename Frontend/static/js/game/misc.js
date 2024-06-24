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

function setShadow(canvas, shadowColor)
{
	canvas.ctx.shadowColor = shadowColor; // Shadow color with alpha (transparency)
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

function startMode(mode, inviterId=null)
{
	document.getElementById('mainMenu').classList.toggle('hidden');
	document.getElementById('gameInfo').classList.toggle('hidden');
	mode == 4 && document.getElementById('specs').classList.toggle('hidden');
	gameSocket.send(JSON.stringify({ 'type': 'start', mode, 'inviter_id': inviterId }));
}

async function leaveMatch()
{
	await gameSocket.send(JSON.stringify({ 'type': 'leave'}));
	window.location.replace('/');
}

function soloOrDuo(parentId)
{
	const parentMenu = document.getElementById(parentId);
	const btnsWrapper = parentMenu.querySelector('.btns-wrapper');
	btnsWrapper.innerHTML = '';
	['Solo', 'Duo'].forEach((v, i) => {
		btnsWrapper.innerHTML += `<button class="game-mode-btn" onclick="startMode(${i + 1})"><i class="fa fa-user${i?'s':''}"></i> ${v}</button>`
	});
}

function spec(mode, e)
{
	e.currentTarget.setAttribute('onclick', null);
	e.currentTarget.classList.toggle('disabled');
	gameSocket.send(JSON.stringify({ 'type': 'spec', mode }));
}


// Below is only for temp
function submitDataToSessionStorage(e)
{
	e.preventDefault();
	console.log("The sessionStorage before is: ", sessionStorage);
	const form = e.currentTarget;
	const customId = form.querySelector('#customId').value;
	const customImg = form.querySelector('#customImg').value;
	// Don't forget to disable this later
	sessionStorage.setItem('id', customId);
	sessionStorage.setItem('pfp', customImg);
	console.log("The sessionStorage is: ", sessionStorage);
}