"use strict"

// Test Start
function clearWaiters()
{
	document.getElementById('leftWaiters').innerHTML = '';
	document.getElementById('rightWaiters').innerHTML = '';
}

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

function readyToPlayCounter(isTournament) {
	console.log("I got into the counter already");
	let i = 3;
	const message = isTournament
		? "You will be redirected to /game"
		: "Be Ready to play";
	document.getElementById('waitStatus').textContent = `${message} in ${i--}s`;
	const interval = setInterval(() => {
		if (!(i))
		{
			console.log("i is: ", i);
			clearInterval(interval);
			if (isTournament)
				window.location.href = '/game'
			else
			{
				console.log("I should Hide the waitMenu >>>>>>>>\n");
				document.getElementById('waitMenu').classList.toggle('hidden');
			}
		}
		document.getElementById('waitStatus').textContent = `${message} in ${i--}s`;
	}, 1000)
}

function setScore(score) {
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');

	if (score[0] > leftScore.textContent
		|| score[1] > rightScore.textContent)
		// soundFx[1].play();
		console.log('');
	leftScore.textContent = score[0];
	rightScore.textContent = score[1];
}

function checkInvite()
{
	const inviterId = sessionStorage.getItem('inviterId');
	inviterId && startMode(3, inviterId);
}

function checkTournament()
{
	const previous_location = (new URL(document.referrer)).pathname
	previous_location == '/tournament' && startMode(5);
}

function initTournament()
{
	tournamentSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		if (data.type == 'fetch_session_storage')
		{
			tournamentSocket.send(JSON.stringify({
						'type': 'session_storage',
						...sessionStorage
					}));
		}
		else if (data.type == 'session_storage_ack')
		{
			console.log("received the session storage ack<<<<<<");
		}
		else if (data.type == 'log')
		{
			console.log("Log: ", data.log);
		}
		else if (data.type == 'standby')
		{
			document.getElementById('waitStatus').textContent = 'Waiting for people to join...';
			console.log("players fetched: ", data.players);
			// clearWaiters();
			// data.players.forEach((player, i) => {
			// 	const options = {
			// 		sideId: i % 2 == 0 ? 'leftWaiters' : 'rightWaiters',
			// 		// pfpSrc: player.pfpSrc, // will be altered later using the db
			// 		// pfpAlt: player.pfpAlt, // will be altered later using the db
			// 		pName: player,
			// 		lvl: 42 // will be altered later using the db
			// 	}
			// 	addWaiter(options);
			// });
		}
		else if (data.type == 'ready')
		{
			console.log("Ready >>>>>>>>>");
			console.log("players fetched: ", data.players);
			// clearWaiters();
			// data.players.forEach((player, i) => {
			// 	const options = {
			// 		sideId: i % 2 == 0 ? 'leftWaiters' : 'rightWaiters',
			// 		pfpSrc: player.pfpSrc,
			// 		pfpAlt: player.pfpAlt,
			// 		pName: player.pName,
			// 		lvl: player.lvl
			// 	}
			// 	addWaiter(options);
			// });
			readyToPlayCounter(true);
		}
	};
}

function initGame()
{
	// const gameEl = document.getElementById("game");
	const canvas = new Canvas(document.getElementById("gameCanvas"));
	window.addEventListener('resize', canvas.setup.bind(canvas));

	console.log("I init the game>>");
	window.addEventListener("keydown", (e) => {
		// maybe I'll do a global state here for optimization
		console.log("The keydown is detected!!!");
		// e.preventDefault()
		// e.preventDefault(); e.stopPropagation();
		"wsik".includes(e.key) && gameSocket.send(JSON.stringify({
			'type': 'move',
			'key': e.key
		}));
	});

	window.addEventListener("keyup", (e) => {
		// e.preventDefault(); e.stopPropagation();
		gameSocket.send(JSON.stringify({
			'type': 'stop',
			'key': e.key
		}));
	});

	// render function, the function that does all the drawing
	function render({x, y, r, fireball, paddles, barriers}){
		// clear the canvas
		canvas.clear();
		// draw barriers if there are any
		canvas.drawBarrier(barriers);
		// update and draw user's paddle
		paddles.forEach((paddle) => draw_paddle(canvas, paddle));
		// draw the ball
		const c = fireball ? '#f00' : '#fff';
		canvas.drawBall(x, y, r, c);
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

		if (data.type == 'fetch_session_storage')
		{
			gameSocket.send(JSON.stringify({
						'type': 'session_storage',
						...sessionStorage
					}));
		}
		if (data.type == 'session_storage_ack')
		{
			console.log("received the session storage ack<<<<<<");
			checkInvite();
			checkTournament();
		}
		else if (data.type == 'update')
		{
			// console.log("the data from the update is: ", data);
			render(data);
			setScore(data.score);
			// data.hit_fx_span && soundFx[0].play();
		}
		else if (data.type == 'log')
		{
			console.log("Log: ", data.log);
		}
		else if (data.type == 'standby')
		{
			document.getElementById('waitStatus').textContent = 'Waiting for people to join...';
			console.log("players fetched: ", data.players);
			clearWaiters();
			data.players.forEach((player, i) => {
				const options = {
					sideId: i % 2 == 0 ? 'leftWaiters' : 'rightWaiters',
					// pfpSrc: player.pfpSrc, // will be altered later using the db
					// pfpAlt: player.pfpAlt, // will be altered later using the db
					pName: player,
					lvl: 42 // will be altered later using the db
				}
				addWaiter(options);
			});
		}
		else if (data.type == 'ready')
		{
			// console.log("Ready >>>>>>>>>");
			// console.log("players fetched: ", data.players);
			clearWaiters();
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
			readyToPlayCounter(false);
		}
		if (data.type != 'update')
			console.log(`The Type is: ${data.type}, type==ready: ${data.type == 'ready'}`)
	};
	// So that canvas can be accessible to other outside functions
	window.canvasObj = canvas;
}

// execution
let soundFx = [new Audio('/static/sounds/hit.mp3'), new Audio('/static/sounds/score.mp3')]
