$(document).ready(function(){

	// Uses the initialization from initializeCanvas.js
	canvas.init(setup);

	function setup() {
		console.log('Setting up');
		let blueprint = $('#save-map-form input[name="blueprint"]').val();
		tileMap = new TileMap(canvas.getXTiles(), canvas.getYTiles(), canvas.getTileSize(), canvas.getApp().stage, canvas.getApp().renderer, blueprint);
	}

	// UI 
	$('#road-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.TRANSIT_ZONE, SelectionType.COLUMN);
	});
	$('#grass-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.SAFE_ZONE, SelectionType.COLUMN);
	});
	$('#bush-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.BUSH, SelectionType.SIMPLE);
	});
	$('#rock-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.ROCK, SelectionType.SIMPLE);
	});
	$('#powerup-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.POWER_UP_FLASH, SelectionType.SIMPLE);
	});
	$('#motorcycle-btn').click(function(e){
		selectMapButton(this, VisualEntityModel.MOTORCYCLE, SelectionType.SIMPLE);
	});
	$('#save-map-form').on('submit', function(e){
		var mapname = $('#save-map-form input[name="mapname"]').val();
		var blueprint = JSON.stringify(tileMap.getMapBlueprint());
		console.log(blueprint);
		if (mapname !== '') {
			$('#save-map-form input[name="blueprint"]').val(blueprint);
			console.log('Map saved!');
		}
		else {
			e.preventDefault();
		}
	});

	function selectMapButton (btnTag, model, selectionType) {
		if ($(btnTag).hasClass('map-btn-selected')) {
			$(btnTag).removeClass('map-btn-selected');
			tileMap.resetSelection();
		}
		else {
			$('.map-creator-btn img').removeClass('map-btn-selected');
			$(btnTag).addClass('map-btn-selected');
			tileMap.setSelectedModel(model, selectionType);
		}
	}
});