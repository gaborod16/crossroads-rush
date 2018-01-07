$(document).ready(function(){

	// Aliases
	let Application = PIXI.Application,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite,
		Graphics = PIXI.Graphics,
		TilingSprite = PIXI.extras.TilingSprite;

	// Canvas dimensions
	let width = Math.floor($('#map').width()),
		height = Math.floor($('#map').height()),
		yTiles = 6,
		tileSize = (height-(2*yTiles))/yTiles,
		xTiles = Math.floor(width / tileSize);

	let app = new Application({
		width: width, 
		height: height,
		antialias: true
	});

	console.log("Tilesize: " + tileSize);
	console.log("Width: " + width);
	console.log("Height: " + height);
	console.log("real Width: " + tileSize * xTiles);
	console.log("real Height: " + tileSize * yTiles);

	app.renderer.backgroundColor = 0xFFFFFF;
	app.renderer.autoResize = true;
	$('#map').append(app.view);

	loader
		.add([
			'/assets/road.png',
			'/assets/meadow.jpg',
			'/assets/rock.png',
			'/assets/gift.png',
		])
		.on('progress', progressHandler)
		.load(setup)

	function progressHandler(loader, resource) {
		console.log('Loading: ' + loader.progress + '%');
	}


	var grid = [];

	function drawGrid() {

		for (var i = 0; i < xTiles; i++) {
			grid[i] = [];
			for (var j = 0; j < yTiles; j++) {
				grid[i][j] = new Graphics();
				grid[i][j].lineStyle(1, 0x222222, 1);
				grid[i][j].beginFill(0xFFFFFF);
				grid[i][j].drawRect(tileSize*i, tileSize*j, tileSize, tileSize);
				grid[i][j].interactive = true;
				grid[i][j].mouseover = function(mouseData) {
				  this.tint = 0x000044;
				}

				grid[i][j].mouseout = function(mouseData) {
				  this.tint = 0xFFFFFF;
				}
				app.stage.addChild(grid[i][j]);

				// grid[i][j].tint = 0xff3300;
			}
		}

		// let rectangle = new Graphics();
		// rectangle.lineStyle(1, 0x222222, 1);
		// rectangle.beginFill(0xFFFFFF);
		// rectangle.drawRect(0, 0, tileSize, tileSize);
		// rectangle.endFill();

		// let gridSprite = new PIXI.extras.TilingSprite(
		//     rectangle.generateTexture(),
		//     app.screen.width,
		//     app.screen.height
		// );

		// app.stage.addChild(gridSprite);

		// app.stage.addChild(rectangle);
	}

	function setup() {
		console.log('Setting up');

		drawGrid();

		// let rock = new Sprite(
		// 	resources['/assets/rock.png'].texture
		// );
		// rock.width = 50;
		// rock.height = 50;

		// app.stage.addChild(rock);
	}

	
});