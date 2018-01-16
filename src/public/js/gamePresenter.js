$(document).ready(function(){

	// Uses the initialization from initializeCanvas.js
	canvas.init(setup);
	var game = undefined;

	function setup() {
		console.log('Setting up');
		let blueprint = $('#blueprint').val();

		game = new GameModule.Game(blueprint, canvas);

		game.addPlayer('gabe');
		game.start();

		state = play;

		canvas.getApp().ticker.add(delta => gameLoop(delta));
	}

	function gameLoop(delta){
	  //Update the current game state:
	  state(delta);
	}

	function play(delta) {
		// handle input
		game.handleInput();

		// check physics
			//collision and so on
		game.update();

		// render
		game.render();
		if (game.isGameOver()) {
			state = end;
		}
		// console.log('playing');
	}

	function end(delta) {
		let winner = game.getWinner();

		if (winner) {
			console.log(winner.getUsername() + ", you won the game!");	
		}
		else {
			console.log("Game Over!");	
		}
		canvas.getApp().ticker.stop();
		//print a you won message
	}
});