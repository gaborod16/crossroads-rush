var TileMap = (function() {

	const HIGHLIGHT_COLOR = 0xAFCBF7;
	const WHITE_COLOR = 0xFFFFFF;
	const CELL_COLOR = 0xDEDEDE;

	const SelectionType = {
		SIMPLE: 'simple',
		COLUMN: 'column',
		NONE: 'none'
	};

	class TileMap {
		constructor (xTiles, yTiles, tileSize, layers, renderer, blueprint=undefined, isEditor=true) {
			// Initialize Tile static properties
			Tile.selectionType = SelectionType.NONE;
			Tile.selectedModel = undefined;

			// Initialize roads (Only used on the gameplay)
			this._roads = new Map();

			// Initialize TileMap
			this._layers = layers;
			this._renderer = renderer;
			this._cols = xTiles;
			this._rows = yTiles;
			this._tileSize = tileSize;
			this._defaultTileTexture = this._createTileTexture();
			this._grid = [];
			this._level = MapLevel.LEVEL_1;

			if (blueprint) {
				this._generateFromBlueprint(blueprint, isEditor);
			}
			else {
				for (var i = 0; i < xTiles; i++) {
					this._grid[i] = [];
					for (var j = 0; j < yTiles; j++) {
						this._grid[i][j] = new Tile(this._layers, this._tileSize, new Position(i,j,tileSize), this._defaultTileTexture);
						this._setTileEvents(i,j);
					}
				}
			}
		}

		_setTileEvents(i,j) {
			this._grid[i][j].setMouseOverEvent(this.genTileMouseover(this._grid, i, j));
			this._grid[i][j].setMouseOutEvent(this.genTileMouseout(this._grid, i, j));
			this._grid[i][j].setMouseClickEvent(this.genTileMouseClick(this._grid, i, j));
		}

		resetSelection () {
			Tile.selectedModel = undefined;
			Tile.selectionType = SelectionType.NONE;
		}

		setSelectedModel (selectedModel, selectionType) {
			Tile.selectedModel = selectedModel;
			Tile.selectionType = selectionType;
		}

		genTileMouseover (tilesMap, column, row) {
			return function (mouseData) {
				switch (Tile.selectionType) {
					case SelectionType.COLUMN:
						for (var i = 0; i < tilesMap[column].length; i++) {
							tilesMap[column][i].tint(HIGHLIGHT_COLOR);
						}
						break;

					case SelectionType.SIMPLE:
						tilesMap[column][row].tint(HIGHLIGHT_COLOR);
						break;

					default:
						break;
				}
			}
		}

		genTileMouseout (tilesMap, column, row) {
			return function (mouseData) {
				switch (Tile.selectionType) {
					case SelectionType.COLUMN:
						for (var i = 0; i < tilesMap[column].length; i++) {
							tilesMap[column][i].tint(WHITE_COLOR);
						}
						break;

					case SelectionType.SIMPLE:
						tilesMap[column][row].tint(WHITE_COLOR);
						break;

					default:
						break;
				}
			}
		}

		genTileMouseClick (tilesMap, column, row) {
			return function (mouseData) {
				switch (Tile.selectionType) {
					case SelectionType.COLUMN:
						for (var i = 0; i < tilesMap[column].length; i++) {
							tilesMap[column][i].setZoneWithModel(Tile.selectedModel);
						}
						break;

					case SelectionType.SIMPLE:
						tilesMap[column][row].setChildWithModel(Tile.selectedModel);
						break;

					default:
						break;
				}
			}
		}

		getTile(x,y) {
			return this._grid[x]? this._grid[x][y] : undefined;
		}

		getRoad(x) {
			return this._roads.get(x);
		}

		getMapBlueprint () {
			var textMap = {
				size: {cols: this._cols, rows: this._rows},
				config: {
					sheepSpeed: 1.0,
					nLives: 1,
					level: MapLevel.LEVEL_1.code
				},
				rawMap: []
			};

			for (var i = 0; i < this._cols; i++) {
				textMap.rawMap[i] = this._grid[i][0].getZone().getMappedEntity();
				for (var j = 0; j < this._rows; j++) {
					if (this._grid[i][j].getChild()) {
						textMap.rawMap[i].entities[j] = this._grid[i][j].getChild().getMappedEntity();
					}
				}
			}
			return textMap;
		}

		_createTileTexture (tileSize) {
			let tile = new PIXI.Graphics();
			tile.lineStyle(1, WHITE_COLOR, 1);
			tile.beginFill(CELL_COLOR);
			tile.drawRect(0, 0, this._tileSize, this._tileSize);
			tile.endFill();
			return this._renderer.generateTexture(tile);
		}

		_generateFromBlueprint (blueprint, isEditor) {
			var fMap = JSON.parse(blueprint)[0]; //formattedMap
			var currentZoneModel = undefined;

			if (isEditor) {
				for (let i = 0; i < this._cols; i++) {
					this._grid[i] = [];
					currentZoneModel = VisualEntityModel.findByCode(fMap.rawMap[i].zone);
					
					for (let j = 0; j < this._rows; j++) {
						this._grid[i][j] = new Tile(this._layers, this._tileSize, new Position(i,j,this._tileSize), this._defaultTileTexture);
						this._setTileEvents(i,j); // This is the only line that is different. It should be refactored
						this._grid[i][j].setZoneWithModel(currentZoneModel);
						
						if (fMap.rawMap[i].entities && fMap.rawMap[i].entities[j]) {
							this._grid[i][j].setChildWithModel(
								VisualEntityModel.findByCode(fMap.rawMap[i].entities[j].code)
							);
						}
					}
				}
			}
			else {
				for (let i = 0; i < this._cols; i++) {
					this._grid[i] = [];
					currentZoneModel = VisualEntityModel.findByCode(fMap.rawMap[i].zone);

					if (currentZoneModel == VisualEntityModel.TRANSIT_ZONE) {
						this._roads.set(i, new Road(this._layers, i, this._rows, this._tileSize));
					}

					for (let j = 0; j < this._rows; j++) {
						this._grid[i][j] = new Tile(this._layers, this._tileSize, new Position(i,j,this._tileSize), this._defaultTileTexture);
						this._grid[i][j].setZoneWithModel(currentZoneModel);

						if (fMap.rawMap[i].entities && fMap.rawMap[i].entities[j]) {
							let entity = fMap.rawMap[i].entities[j];
							let model = VisualEntityModel.findByCode(entity.code);

							if (model.getEntity().prototype instanceof Vehicle) { // Vehicle
								this._roads.get(i).createVehicle(model, j);
							}
							else {
								this._grid[i][j].setChildWithModel(VisualEntityModel.findByCode(entity.code));
							}
						}
					}
				}
			}
		}

		update() {
			for (let [ col, road ] of this._roads.entries()) {
				road.updateVehicles();
			}
		}
		render() {
			for (let column of this._grid) {
				for (var i = 0; i < column.length; i++) {
					column[i].render();
				}
			}
			for (let [ col, road ] of this._roads.entries()) {
				road.renderVehicles();
			}
		}
	}

	class Tile {
		constructor (layers, tileSize, position, defaultTexture) {
			this._layers = layers;
			this._tileSize = tileSize;
			this._defaulTexture = defaultTexture;
			this._tile = new PIXI.Sprite(defaultTexture);
			this._tile.x = position.getRealX();
			this._tile.y = position.getRealY();
			this._tile.width = tileSize;
			this._tile.height = tileSize;
			this._tile.interactive = true;
			this._position = position;
			this._zone = undefined;

			this._layers[IndexLayer.LEVEL_1].addChild(this._tile);
		}

		_removeChild () {
			let child = this._zone.getChild();
			this._layers[child.getLayer()].removeChild(child.getSprite());
			this._zone.removeChild();
		}

		getZone () {
			return this._zone;
		}

		getChild () {
			return this._zone.getChild();
		}

		render () {
			this._zone.render();
		}

		tint (color) {
			this._tile.tint = color;
		}

		setZoneWithModel (zoneModel) {
			this._zone = zoneModel.instantiateEntity(0, this._position);
			this._zone.setSprite(this._tile);
			this._tile.texture = PIXI.loader.resources[this._zone.getResource()].texture;
		}

		setChildWithModel (childModel) {
			if (this._zone.allowsChildModel(childModel)) {
				if (this._zone.hasChild()) {
					let onlyRemove = this._zone.getChild().getModel() == childModel;
					this._removeChild();
					if (onlyRemove) {
						return;
					}
				}
				let child = childModel.instantiateEntity(0, this._position.clone());
				let texture = PIXI.loader.resources[child.getResource()].texture
				let sprite = new PIXI.Sprite(texture);

				child.setSprite(sprite);
				this._zone.setChild(child);
				this._layers[child.getLayer()].addChild(child.getSprite());
				// this._tile.addChild(this._zone.getChild().getSprite());
			}
		}

		setMouseOverEvent (func) {
			this._tile.mouseover = func;
		}

		setMouseOutEvent (func) {
			this._tile.mouseout = func;
		}

		setMouseClickEvent (func) {
			this._tile.click = func;
		}
	}
	// Tile's static properties
	Tile.selectionType = undefined;
	Tile.selectedModel = undefined;

	class Road {
		constructor(layers, columnId, nRows, tileSize) {
			this._layers = layers;
			this._column = columnId; // zero-indexed
			this._nRows = nRows;
			this._tileSize = tileSize;
			this._vehicles = [];
			this._startRoad = tileSize * nRows;
			this._finishRoad = 0;
		}
		createVehicle(vehicleModel, rowId) {
			let vehicle = vehicleModel.instantiateEntity(0, new RealPosition(this._column, rowId, this._tileSize));
			let texture = PIXI.loader.resources[vehicle.getResource()].texture
			let sprite = new PIXI.Sprite(texture);

			vehicle.setSprite(sprite);
			this._layers[vehicle.getLayer()].addChild(vehicle.getSprite());
			this._vehicles.push(vehicle);
		}
		updateVehicles() {
			for(let v of this._vehicles) {
				v.move();
				if (v.getPosition().getRealY() < this._finishRoad) {
					v.resetTo(this._startRoad);
				}
			}
		}
		renderVehicles() {
			for(let v of this._vehicles) {
				v.render();
			}
		}
		// colision detection
		collidedWith(position) {
			for(let v of this._vehicles) {
				if (v.hasCollidedWith(position, this._tileSize)) {
					return v;
				}
			}
			return undefined;
		}
		// generateVehicles() {
		// 	for (let column of this._grid) {
		// 		//if can gen, gen
		// 	}
		// }
		// canGenerateVehicle(column) {
		// 	for (let i = this._rows - this._level.vehicleSpace; i < this._rows; i++) {
		// 		if (column[i].getZone().hasChild()) {
		// 			return false;
		// 		}
		// 	}
		// 	return true;
		// }
	}

	return {
		TileMap: TileMap,
		SelectionType: SelectionType
	}

})();