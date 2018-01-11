const HIGHLIGHT_COLOR = 0xAFCBF7;
const WHITE_COLOR = 0xFFFFFF;
const CELL_COLOR = 0xDEDEDE;

const SelectionType = {
	SIMPLE: 'simple',
	COLUMN: 'column',
	NONE: 'none'
};

class TileMap {
	constructor (xTiles, yTiles, tileSize, stage, renderer) {
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

		for (var i = 0; i < xTiles; i++) {
			this._grid[i] = [];
			for (var j = 0; j < yTiles; j++) {
				this._grid[i][j] = new Tile(new Position(i*tileSize,j*tileSize));
				this._grid[i][j].setMouseOverEvent(this.genTileMouseover(this._grid, i, j));
				this._grid[i][j].setMouseOutEvent(this.genTileMouseout(this._grid, i, j));
				this._grid[i][j].setMouseClickEvent(this.genTileMouseClick(this._grid, i, j));
			}
		}
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
						tilesMap[column][i].changeZone(Tile.selectedModel);
					}
					break;

				case SelectionType.SIMPLE:
					tilesMap[column][row].changeChild(Tile.selectedModel);
					break;

				default:
					break;
			}
		}
	}

	getTextMap () {
		var textMap = {
			size: {cols: this._cols, rows: this._rows},
			config: {
				sheepSpeed: 1.0,
				nLives: 1,
				level: GameLevel.LEVEL_1.code
			},
			rawMap: []
		};

		for (var i = 0; i < this._cols; i++) {
			textMap.rawMap[i] = this._grid[i][0].getZone().getMappedEntity();
			for (var j = 0; j < this._rows; j++) {
				if (this._grid[i][j].getChild()) {
					textMap.rawMap[i].entities.push(this._grid[i][j].getChild().getMappedEntity());
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
}

class Tile {
	constructor (position) {
		this._tile = new PIXI.Sprite(Tile.defaultTileTexture);
		this._tile.x = position.getX();
		this._tile.y = position.getY();
		this._tile.width = Tile.size;
		this._tile.height = Tile.size;
		this._tile.interactive = true;
		this._position = new Position(
			Math.floor(position.getX()/Tile.size),
			Math.floor(position.getY()/Tile.size)
		);
		this._zone = undefined;

		Tile.stage.addChild(this._tile);
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

	tint (color) {
		this._tile.tint = color;
	}

	changeZone (zoneModel) {
		this._zone = zoneModel.instantiateEntity(0, this._position);
		this._tile.texture = PIXI.loader.resources[this._zone.getResource()].texture;
	}

	changeChild (childModel) {
		console.log(this._position);
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