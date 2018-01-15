const HIGHLIGHT_COLOR = 0xAFCBF7;
const WHITE_COLOR = 0xFFFFFF;
const CELL_COLOR = 0xDEDEDE;

const SelectionType = {
	SIMPLE: 'simple',
	COLUMN: 'column',
	NONE: 'none'
};

class TileMap {
	constructor (xTiles, yTiles, tileSize, stage, renderer, blueprint=undefined, isEditor=true) {
		// Initialize Tile static properties
		Tile.stage = stage;
		Tile.size = tileSize;
		Tile.selectionType = SelectionType.NONE;
		Tile.selectedModel = undefined;

		// Initialize TileMap
		this._stage = stage;
		this._renderer = renderer;
		this._cols = xTiles;
		this._rows = yTiles;
		this._tileSize = tileSize;
		this._createTileTexture();
		this._grid = [];
		this._level = MapLevel.LEVEL_1;

		if (blueprint) {
			this._generateFromBlueprint(blueprint, isEditor);
		}
		else {
			for (var i = 0; i < xTiles; i++) {
				this._grid[i] = [];
				for (var j = 0; j < yTiles; j++) {
					this._grid[i][j] = new Tile(new Position(i,j,tileSize));
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
		Tile.defaultTileTexture = this._renderer.generateTexture(tile);
	}

	_generateFromBlueprint (blueprint, isEditor) {
		var fMap = JSON.parse(blueprint)[0]; //formattedMap
		var currentZoneModel = undefined;

		if (isEditor) {
			for (var i = 0; i < this._cols; i++) {
				currentZoneModel = VisualEntityModel.findByCode(fMap.rawMap[i].zone);
				this._grid[i] = [];
				for (var j = 0; j < this._rows; j++) {
					this._grid[i][j] = new Tile(new Position(i,j,this._tileSize));
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
			for (var i = 0; i < this._cols; i++) {
				currentZoneModel = VisualEntityModel.findByCode(fMap.rawMap[i].zone);
				this._grid[i] = [];
				for (var j = 0; j < this._rows; j++) {
					this._grid[i][j] = new Tile(new Position(i,j,this._tileSize));
					this._grid[i][j].setZoneWithModel(currentZoneModel);

					if (fMap.rawMap[i].entities && fMap.rawMap[i].entities[j]) {
						let entity = fMap.rawMap[i].entities[j];
						let entitySuper = VisualEntityModel.findSuperByCode(entity.code);

						if (entitySuper == Vehicle) { // Vehicle
							console.log('vehicle');
							this._grid[i][j].createVehicle (
								VisualEntityModel.findByCode(entity.code)
							);
						}
						else {
							console.log('vehicle');
							this._grid[i][j].setChildWithModel (
								VisualEntityModel.findByCode(entity.code)
							);
						}
					}
				}
			}
		}
		console.log(this);
	}
	generateVehicles() {
		for (let column of this._grid) {
			//if can gen, gen
		}
	}
	canGenerateVehicle(column) {
		for (let i = this._rows - this._level.vehicleSpace; i < this._rows; i++) {
			if (column[i].getZone().hasChild()) {
				return false;
			}
		}
		return true;
	}

	update() {
		for (let column of this._grid) {
			if (column[0].getZone() instanceof TransitZone) {
				for (var i = 0; i < column.length; i++) {
					// check if has vehicle
					if (column[i].hasVehicleChild()) {
						let vehicle = column[i].getChild();
						vehicle.move();
						// check if vehicle changed tiles
						if (vehicle.getPosition().getY() < i) {
							column[i].removeVehicle();
							if (i != 0) {
								column[i-1].addVehicle(vehicle);
							}
							else {
								// column[this._rows-1].addVehicle(vehicle);
								column[this._rows-1].createVehicle(vehicle.getModel());

								// this._grid[i][j].createVehicle (
								// 	VisualEntityModel.findByCode(entity.code)
								// );
								// Tile.stage.removeChild(vehicle);
							}
						}
					}
				}
			}
		}
	}
	render() {
		for (let column of this._grid) {
			for (var i = 0; i < column.length; i++) {
				if (column[i].getChild()) {
					column[i].getChild().render();
				}
			}
		}
	}
}

class Tile {
	constructor (position) {
		this._tile = new PIXI.Sprite(Tile.defaultTileTexture);
		this._tile.x = position.getRealX();
		this._tile.y = position.getRealY();
		this._tile.width = Tile.size;
		this._tile.height = Tile.size;
		this._tile.interactive = true;
		this._position = position;
		this._zone = undefined;

		Tile.stage.addChild(this._tile);
	}

	removeVehicle () {
		this._tile.removeChild(this._zone.getChild().getSprite());
		this._zone.removeChild();
	}

	addVehicle (vehicle) {
		this._zone.setChild(vehicle);
		this._tile.addChild(this._zone.getChild().getSprite());
	}

	createVehicle (vehicleModel) {
		let vehicle = vehicleModel.instantiateEntity(0, new RealPosition(this._position.getX(), this._position.getY(), Tile.size));
		let texture = PIXI.loader.resources[vehicle.getResource()].texture
		let sprite = new PIXI.Sprite(texture);
		sprite.x = vehicle.getPosition().getRealX();
		sprite.y = vehicle.getPosition().getRealY();
		sprite.width = Tile.size;
		sprite.height = Tile.size;

		vehicle.setSprite(sprite);
		this._zone.setChild(vehicle);
		Tile.stage.addChild(this._zone.getChild().getSprite());
	}

	_removeChild () {
		this._tile.removeChild(this._zone.getChild().getSprite());
		this._zone.removeChild();
	}

	getZone () {
		return this._zone;
	}

	getChild () {
		return this._zone.getChild();
	}

	hasVehicleChild () {
		return this._zone.getChild() && this._zone.getChild() instanceof Vehicle;
	}

	tint (color) {
		this._tile.tint = color;
	}

	setZoneWithModel (zoneModel) {
		this._zone = zoneModel.instantiateEntity(0, this._position);
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
			this._zone.setChild(childModel.instantiateEntity(0, this._position));
			let texture = PIXI.loader.resources[this._zone.getChild().getResource()].texture
			this._zone.getChild().setSprite(new PIXI.Sprite(texture));
			this._tile.addChild(this._zone.getChild().getSprite());
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
Tile.defaultTileTexture = undefined;
Tile.stage = undefined;
Tile.size = undefined;