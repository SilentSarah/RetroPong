"use strict"

function initGame()
{
	console.log("initGame got called!");
	initSocket();

	// const gameEl = document.getElementById("game");
	const canvas = new Canvas(document.getElementById("gameCanvas"));
	canvas.user = new Paddle();
	canvas.com = new Paddle();
	canvas.setup();
	window.addEventListener('resize', canvas.setup.bind(canvas));

	console.log("I init the game>>");
	// gameEl.focus();
	window.addEventListener('click', ()=> {
		console.log("I received the click however");
	})
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

	// update function, the function sends update request to the server
	function update()
	{
		if (gameSocket.readyState == WebSocket.OPEN)
			gameSocket.send(JSON.stringify({
				'type': 'update'
			}));
	}

	// render function, the function that does all the drawing
	function render(){
		// clear the canvas
		canvas.clear();
		// update and draw user's paddle
		canvas.user.draw(canvas, 'player');
		// draw the COM's paddle
		canvas.com.draw(canvas);
		// draw the ball
		canvas.drawBall();
	}

	function game(){
		update();
		render();
	}

	setInterval(game, 1/60) // doing a 60 fps

	// Socket code below
	gameSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		const {type, x, y, p1X, p1Y, p2X, p2Y} = data;
		if (type == 'update')
		{
			canvas.ball.x = x;
			canvas.ball.y = y;
			canvas.user.x = p1X;
			canvas.user.y = p1Y;
			canvas.com.x = p2X;
			canvas.com.y = p2Y;
		}
		else if (type == 'log')
		{
			console.log("Log: ", data.log);
		}
		else if (type == 'standby')
		{
			console.log("Players joined are: ", data.players);
		}
	};
	// So that canvas can be accessible to other outside functions
	window.canvasObj = canvas;
}
