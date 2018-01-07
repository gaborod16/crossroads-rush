const SelectionType = {
	SIMPLE: 'simple',
	MULTIPLE: 'multiple'
};

class TileMap {
	constructor (xTiles, yTiles, tileSize, stage, renderer) {
		// Initialize Tile static properties
		Tile.stage = stage;
		Tile.size = tileSize;
		Tile.selectionType = SelectionType.SIMPLE;
		Tile.selectedZone = EntityType.NONE;

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
				this._grid[i][j].setMouseOverEvent(this.genTileMouseover(this._grid[i]));
				this._grid[i][j].setMouseOutEvent(this.genTileMouseout(this._grid[i]));
				this._grid[i][j].setMouseClickEvent(this.genTileMouseClick(this._grid[i]));
			}
		}
	}

	setSelectedZone (zoneType) {
		Tile.selectedZone = zoneType;
		Tile.selectionType = SelectionType.MULTIPLE;
	}

	genTileMouseover (column) {
		return function (mouseData) {
			for (var i = 0; i < column.length; i++) {
				column[i].tint(0xAFCBF7);
			}
		}
	}

	genTileMouseout (column) {
		return function (mouseData) {
			for (var i = 0; i < column.length; i++) {
				column[i].tint(0xFFFFFF);
			}
		}
	}

	genTileMouseClick (column) {
		return function (mouseData) {
			for (var i = 0; i < column.length; i++) {
				column[i].changeTexture(PIXI.loader.resources[Tile.selectedZone.resource].texture);
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
		tile.lineStyle(1, 0xFFFFFF, 1);
		tile.beginFill(0xDEDEDE);
		tile.drawRect(0, 0, this._tileSize, this._tileSize);
		tile.endFill();
		Tile.tileTexture = this._renderer.generateTexture(tile);
	}
}


class Tile {

	constructor (position) {
		// this._tile = new PIXI.Graphics();
		// this._tile.lineStyle(1, 0x222222, 1);
		// this._tile.beginFill(0xFFFFFF);
		// this._tile.drawRect(position.getX(), position.getY(), Tile.size, Tile.size);
		this._tile = new PIXI.Sprite(Tile.tileTexture);
		this._tile.x = position.getX();
		this._tile.y = position.getY();
		this._tile.width = Tile.size;
		this._tile.height = Tile.size;
		this._tile.interactive = true;

		Tile.stage.addChild(this._tile);
	}

	tint (color) {
		this._tile.tint = color;
	}

	changeTexture (texture) {
		this._tile.texture = texture;
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

// static properties
Tile.selectionType = undefined;
Tile.selectedZone = undefined;
Tile.tileTexture = undefined;
Tile.stage = undefined;
Tile.size = undefined;