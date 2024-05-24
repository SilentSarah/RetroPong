"use strict"

// Test Start
function addWaiter(options)
{
	console.log("the options are: ", options);
	const { sideId, pfpSrc, pfpAlt, pName, lvl } = options;
	const component = `<div class="media">
							<img class="pfp" src="${pfpSrc}" alt="${pfpAlt}">
							<div class="details">
								<p class="taprom text-pink-gradient">${pName}</p>
								<div class="level">
									<img src="static/img/icons/explosion.svg" alt="">
									<span class="bold">${lvl}</span>
								</div>
							</div>
						</div>`
	console.log('the sideId is: ', sideId);
	document.getElementById(sideId).innerHTML += component;
	if (document.getElementById('waitMenu').classList.contains('hidden'))
		document.getElementById('waitMenu').classList.toggle('hidden');
}
// Test End

function readyToPlayCounter() {
	console.log("I got into the counter already");
	let i = 3;
	document.getElementById('waitStatus').textContent = `Be Ready to play in ${i--}s`;
	const interval = setInterval(() => {
		if (!(i))
		{
			clearInterval(interval);
			document.getElementById('waitMenu').classList.toggle('hidden');
		}
		document.getElementById('waitStatus').textContent = `Be Ready to play in ${i--}s`;
	}, 1000)
}


function initGame()
{
	console.log("initGame got called!");
	initSocket();

	// const gameEl = document.getElementById("game");
	const canvas = new Canvas(document.getElementById("gameCanvas"));
	window.addEventListener('resize', canvas.setup.bind(canvas));

	console.log("I init the game>>");
	window.addEventListener("keydown", (e) => {
		// maybe I'll do a global state here for optimization
		console.log("The keydown is detected!!!");
		// e.preventDefault()
		// e.preventDefault(); e.stopPropagation();
		let direction;
		if (e.key == 'w')
			direction = 'up'
		else if (e.key == 's')
			direction = 'down'
		else
			return ;
		gameSocket.send(JSON.stringify({
			'type': 'move',
			'direction': direction
		}));
	});

	window.addEventListener("keyup", (e) => {
		// e.preventDefault(); e.stopPropagation();
		gameSocket.send(JSON.stringify({
			'type': 'stop'
		}));
	});

	// render function, the function that does all the drawing
	function render({x, y, r, paddles}){
		// clear the canvas
		canvas.clear();
		// update and draw user's paddle
		paddles.forEach((paddle) => draw_paddle(canvas, paddle));
		// draw the ball
		canvas.drawBall(x, y, r);
	}

	// update function, the function sends update request to the server
	function update()
	{
		if (gameSocket.readyState == WebSocket.OPEN)
			gameSocket.send(JSON.stringify({
				'type': 'update'
			}));
	}

	setInterval(update, 1000/60) // doing a 60 fps

	// Socket code below
	gameSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		
		if (data.type == 'update')
		{
			// console.log("the data from the update is: ", data);
			render(data);
		}
		else if (data.type == 'log')
		{
			console.log("Log: ", data.log);
		}
		else if (data.type == 'standby')
		{
			document.getElementById('waitStatus').textContent = 'Waiting for people to join...';
			console.log("players fetched: ", data.players);
			data.players.forEach((player, i) => {
				const options = {
					sideId: i % 2 == 0 ? 'leftWaiters' : 'rightWaiters',
					pfpSrc: player.pfpSrc,
					pfpAlt: player.pfpAlt,
					pName: player.pName,
					lvl: player.lvl
				}
				addWaiter(options);
			});
		}
		else if (data.type == 'ready')
		{
			// console.log("Ready >>>>>>>>>");
			// console.log("players fetched: ", data.players);
			data.players.forEach((player, i) => {
				const options = {
					sideId: i % 2 == 0 ? 'leftWaiters' : 'rightWaiters',
					pfpSrc: player.pfpSrc,
					pfpAlt: player.pfpAlt,
					pName: player.pName,
					lvl: player.lvl
				}
				addWaiter(options);
			});
			readyToPlayCounter();
		}
		if (data.type != 'update')
			console.log(`The Type is: ${data.type}, type==ready: ${data.type == 'ready'}`)
	};
	// So that canvas can be accessible to other outside functions
	window.canvasObj = canvas;
}
