$(document).ready(function(){

	// var socket = io();
	// console.log('printing client.js');

	var back = '';

	function getMenuPage(url, listenersFunc) {
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'text',
			success: function (res) {
				$('#menu-content').html(res);
				listenersFunc();
			},
			error: function (err) {
				console.log('Error: ' + err.responseText);
			},
			complete: function (req, status) {
				console.log('Status: ' + status + ' Request completed!');
			}
		});
	}

	function createMap() {
		$.ajax({
			url: '/user/map/new',
			type: 'POST',
			dataType: 'json',
			data: {
				name: 'map2',
				owner: 'gabe',
				size: {width: 12},
				config: {sheepSpeed: 0.5, nLives: 1},
				text: [
					{type: 's', objs: ['b1','b2']},
					{type: 't', objs: ['pr5']},
					{type: 't', objs: []},
					{type: 's', objs: ['b2']}
				]
			},
			success: function (res) {
				console.log('Map created successfully!');
			},
			error: function (err) {
				console.log('Error: ' + err.responseText);
			},
			complete: function (req, status) {
				console.log('Request complete!');
				console.log(status);
			}
		});
	}

	// function getUserMaps() {
	// 	$.ajax({
	// 		url: 'user/maps',
	// 		type: 'GET',
	// 		dataType: 'json',
	// 		success: function (res) {
	// 			var mapsHtml = '';

	// 			for (var i = 0; i < res.length; i++) {
	// 				mapsHtml += 'a.dropdown-item ' + res[i].name + ' ';
	// 			}

	// 			$('#mapDropdown').html(mapsHtml);
	// 		},
	// 		error: function (err) {
	// 			console.log('Error: ' + err);
	// 		},
	// 		complete: function (req, status) {
	// 			console.log('Request complete!');
	// 			console.log(status);
	// 		}
	// 	});
	// }

	function mainMenuListeners() {
		let url = 'menu/main';

		$('#online-btn').click(function(e){
			console.log('online clicked!');
			back = url;
		});

		$('#offline-btn').click(function(e){
			console.log('offline clicked!');
			back = url;
		});

		$('#manage-maps-btn').click(function(e){
			getMenuPage('menu/maps', manageMapMenuListeners);
			back = url;
		});

		$('#about-btn').click(function(e){
			console.log('about clicked!');
			back = url;
		});
	}

	function manageMapMenuListeners() {
		let url = 'menu/maps';

		// $('#add-map-btn').click(function(e){
		// 	getPage('map_creator');
		// 	console.log('add clicked!');
		// 	// createMap();
		// 	back = url;
		// });

		// $('#edit-map-btn').click(function(e){
		// 	getPage('map_creator');
		// 	console.log('edit clicked!');
		// 	back = url;
		// });

		$('#del-map-btn').click(function(e){
			console.log('del clicked!');
			back = url;
		});
	}

	// On load executions
	mainMenuListeners();
});