// function initMenu() {
// 	const pauseButton = document.getElementById('pauseButton');
// 	pauseButton.on
// }

function toggleMenu(...menusIds) {
	menusIds.forEach((menuId) => {
		document.getElementById(menuId).classList.toggle('hidden');
	})
}

function setCanvasColor(colorId) {
	switch(colorId) {
		case 1:
			// change later
			window.canvasObj.canvasColors = ['#ffd156', '#ffa3ac'];
			break ;
		case 2:
			window.canvasObj.canvasColors = ['#ffcfea', '#bfb9ff', '#afe9ff'];
			break ;
		case 3:
			window.canvasObj.canvasColors = ['#000', '#000'];
			break ;
		default:
			window.canvasObj.canvasColors = ['#262f81', '#c773ca', '#878387']; // retro
	} 
}