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

	// Load assets
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

	// Map editor variables
	var tMap = undefined;

	function setup() {
		console.log('Setting up');
		tMap = new TileMap(xTiles, yTiles, tileSize, app.stage, app.renderer);

		// console.log(resources['/assets/rock.png'].texture);

		// let rock = new Sprite(
		// 	resources['/assets/rock.png'].texture
		// );
		// rock.width = 50;
		// rock.height = 50;

		// let superSquare = new PIXI.Sprite(texture);

		// app.stage.addChild(superSquare);
	}

	// UI 

	$('#road-btn').click(function(e){
		console.log('road clicked!');
		selectMapButton(this, EntityType.TRANSIT_ZONE);
	});
	$('#meadow-btn').click(function(e){
		console.log('meadow clicked!');
		selectMapButton(this, EntityType.SAFE_ZONE);
	});
	$('#config-map-btn').click(function(e){
		console.log('config map clicked!');
		// selectMapButton(this, 'none');
	});

	function selectMapButton (btnTag, type) {
		if ($(btnTag).hasClass('map-btn-selected')) {
			$(btnTag).removeClass('map-btn-selected');
			tMap.setSelectedZone(EntityType.NONE);
		}
		else {
			$('.map-creator-btn img').removeClass('map-btn-selected');
			$(btnTag).addClass('map-btn-selected');
			tMap.setSelectedZone(type);
		}
	}
});