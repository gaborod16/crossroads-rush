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
			getMenuPage('menu/play_offline', managePlayOfflineMenuListeners);
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

		$('#edit-map-form').on('submit', function(e){
			var mapname = $('#mapSelection').find(":selected").text();
			$('#edit-map-form input[name="mapname"]').val(mapname);
			back = url;
		});

		$('#del-map-btn').click(function(e){
			console.log('del clicked!');
			back = url;
		});
	}

	function managePlayOfflineMenuListeners() {
		let url = 'menu/play_offline';

		$('#play-map-form').on('submit', function(e){
			var mapname = $('#mapSelection').find(":selected").text();
			$('#play-map-form input[name="mapname"]').val(mapname);
			back = url;
		});
	}

	// On load calls
	mainMenuListeners();
});