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
		Tile.modelType = undefined;

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
		Tile.modelType = undefined;
		Tile.selectionType = SelectionType.NONE;
	}

	setModelType (modelType, selectionType) {
		Tile.modelType = modelType;
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
						tilesMap[column][i].changeTexture(PIXI.loader.resources[Tile.modelType.getResource()].texture);
					}
					break;

				case SelectionType.SIMPLE:
					tilesMap[column][row].changeChild(Tile.modelType);
					break;

				default:
					break;
			}
		}
	}

	scream () {
		for (var i = 0; i < this._cols; i++) {
			this._grid[i] = [];
			for (var j = 0; j < this._rows; j++) {
				console.log("Imagine");
			}
		}
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
		this._resetChild();

		Tile.stage.addChild(this._tile);
	}

	tint (color) {
		this._tile.tint = color;
	}

	changeTexture (texture) {
		this._tile.texture = texture;
	}

	_resetChild () {
		this._child = {
			obj: undefined,
			type: undefined
		};
	}

	changeChild (childType) {
		if (this._child.obj) {
			let onlyRemove = this._child.type == childType;
			this._tile.removeChild(this._child.obj);
			this._resetChild();
			if (onlyRemove) {
				return;
			}
		}
		let texture = PIXI.loader.resources[childType.getResource()].texture
		this._child.obj = new PIXI.Sprite(texture);
		this._child.type = childType;
		this._tile.addChild(this._child.obj);
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
Tile.modelType = undefined;
Tile.defaultTileTexture = undefined;
Tile.stage = undefined;
Tile.size = undefined;