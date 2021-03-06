var GameModule = (function() {
	const EVENT_KEY = {
		LEFT: 97,
		DOWN: 115,
		RIGHT: 100,
		UP: 119
	}

	class LocalController {
		constructor(sheep) {
			this._sheep = sheep;
			this._moveCommand = undefined;
		}
		getSheep() {
			return this._sheep;
		}
		popCommand() {
			let temp = this._moveCommand;
			this._moveCommand = undefined;
			return temp;
		}
		activate() {
			$(document).on( "keypress", {controller: this}, function( e ) {
				var controller = e.data.controller;
				var sheep = controller.getSheep();

				switch (e.which) {
					case EVENT_KEY.LEFT:
						controller._moveCommand = new MoveLeftCommand(sheep);
						// console.log("Go left");
						break;
					case EVENT_KEY.RIGHT:
						controller._moveCommand = new MoveRightCommand(sheep);
						// console.log("Go right");
						break;
					case EVENT_KEY.DOWN:
						controller._moveCommand = new MoveDownCommand(sheep);
						// console.log("Go down");
						break;
					case EVENT_KEY.UP:
						controller._moveCommand = new MoveUpCommand(sheep);
						// console.log("Go up");
						break;
				}
			});
		}
		deactivate() {
			$(document).off("keypress");
		}
	}

	class Player {
		constructor(username, controller) {
			this._username = username;
			this._sheep = undefined;
			this._controller = controller;
		}
		addSheep(sheep) {
			this._sheep = sheep;
		}
		getUsername() {
			return this._username;
		}
		getController() {
			return this._controller;
		}
		getLastCommand() {
			return this._controller.popCommand();
		}
		getSheep() {
			return this._sheep;
		}
	}

	class Game {
		constructor(blueprint, canvas){
			this._layers = [
				new PIXI.Container(), 	// IndexLayer.LEVEL_1; 
				new PIXI.Container(), 
				new PIXI.Container(),
				new PIXI.Container(),
				new PIXI.Container()	// IndexLayer.LEVEL_5;
			];
			this._canvas = canvas;
			this._players = [];
			this._winner = undefined;
			this._addLayers();
			this._map = new TileMap.TileMap(canvas.getXTiles(), canvas.getYTiles(), canvas.getTileSize(), this._layers, canvas.getApp().renderer, blueprint, false);
		}
		_addLayers() {
			for(let layer of this._layers) {
				this._canvas.getApp().stage.addChild(layer);
			}
		}
		addPlayer(playerName) {
			if (playerName) {
				let id = this._players.length;
				let position = new Position(0, id, this._canvas.getTileSize());
				let sheep = new Sheep(id, position);
				let texture = PIXI.loader.resources[sheep.getResource()].texture;
				let sprite = new PIXI.Sprite(texture);
				
				sheep.setSprite(sprite);
				this._layers[sheep.getLayer()].addChild(sheep.getSprite());

				let player = new Player(playerName, new LocalController(sheep));
				player.addSheep(sheep);
				this._players.push(player);
			}
		}
		getPlayers() {
			return this._players;
		}
		start() {
			for(let player of this._players) {
				player.getController().activate();
			}
		}
		handleInput() {
			for (let player of this._players) {
				player.getSheep().handleInput(player.getLastCommand());
			}
		}
		update() {
			//approve to current position
			for (let player of this._players) {
				let sheep = player.getSheep();
				if (sheep.getState() == SheepState.MOVING) {
					let pos = sheep.getNextPosition(); // Evaluate next position (future)
					let tile = this._map.getTile(pos.getX(), pos.getY());
					let road = this._map.getRoad(pos.getX());
					let mudererVehicle = undefined;

					if (tile) {
						if (tile.getZone().hasChild()) {
							tile.getZone().getChild().interact(sheep);
						}
						else if(road && (mudererVehicle = road.collidedWith(pos)) != undefined ) {
							console.log('murdered!');
							mudererVehicle.interact(sheep);
						}
						else {
							// Nothing to interact with
							sheep.setState(SheepState.WELL_MOVED);
						}
					}
					else {
						// Out of bounds
						sheep.setState(SheepState.BADLY_MOVED);
					}
				}
				else if (sheep.getState() == SheepState.STANDING) {
					let pos = sheep.getPosition();
					let road = this._map.getRoad(pos.getX());
					let mudererVehicle = undefined;
					if(road && (mudererVehicle = road.collidedWith(pos)) != undefined ) {
						console.log('murdered!');
						mudererVehicle.interact(sheep);
					}
				}
			}

			this._map.update();

			// update next position
			for (let player of this._players) {
				player.getSheep().update();
			}
		}
		render() {
			for (let player of this._players) {
				player.getSheep().render();
			}
			this._map.render();
		}
		isGameOver() {
			let allSheepDead = true;
			for (let player of this._players) {
				allSheepDead = allSheepDead && (player.getSheep().getState() == SheepState.DEAD);
				if (player.getSheep().getPosition().getX() == canvas.getXTiles() - 1) {
					this._winner = player;
					return true;
				}
			}
			return allSheepDead;
		}
		getWinner() {
			return this._winner;
		}
	}

	return {
		Game: Game
	}
})();