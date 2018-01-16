var canvas = (function () {

	var app = undefined;
	var width, height, yTiles, xTiles, tileSize;

	function init(setupFunc) {
		// Canvas dimensions
		width = Math.floor($('#map').width());
		height = Math.floor($('#map').height());
		yTiles = 6;
		tileSize = (height-(2*yTiles))/yTiles;
		xTiles = 10; //Math.floor(width / tileSize);

		app = new PIXI.Application({
			width: width, 
			height: height,
			antialias: true
		});

		// console.log("App: " + app);
		// console.log("Tilesize: " + tileSize);
		// console.log("Width: " + width);
		// console.log("Height: " + height);
		// console.log("real Width: " + tileSize * xTiles);
		// console.log("real Height: " + tileSize * yTiles);

		app.renderer.backgroundColor = 0xFFFFFF;
		app.renderer.autoResize = true;
		$('#map').append(app.view);

		// Load assets
		PIXI.loader
			.add([
				'/assets/road.png',
				'/assets/grass.png',
				'/assets/rock.png',
				'/assets/powerup.png',
				'/assets/car.png',
				'/assets/bush.png',
				'/assets/sheep.png',
				'/assets/motorcycle.png'
			])
			.on('progress', progressHandler)
			.load(setupFunc);

		function progressHandler(loader, resource) {
			console.log('Loading: ' + PIXI.loader.progress + '%');
		}
	}
	function getApp() {
		return app;
	}
	function getWidth() {
		return width;
	}
	function getHeight() {
		return height;
	}
	function getYTiles() {
		return yTiles;
	}
	function getXTiles() {
		return xTiles;
	}
	function getTileSize() {
		return tileSize;
	}

	return {
		init: init,
		getApp: getApp,
		getWidth: getWidth,
		getHeight: getHeight,
		getYTiles: getYTiles,
		getXTiles: getXTiles,
		getTileSize: getTileSize
	}
})();