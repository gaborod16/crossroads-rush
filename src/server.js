
// IMPORTS
var express = require('express');
var app = express();
var path = require('path');
var db = require('./db');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

// STATIC PATHS
app.use('/js', express.static(path.join(__dirname, '/public/js/')));
app.use('/css', express.static(path.join(__dirname, '/public/css/')));
app.use('/assets', express.static(path.join(__dirname, '/public/assets/')));
app.use('/bower', express.static(path.join(__dirname, '/public/bower_components/')));

// SETUP PUG TEMPLATES
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// USE API CONTROLLER
var ApiController = require('./apiController');
app.use('/', ApiController);



// BEGIN THE SOCKET COMMUNICATION (MOVE FROM HERE)
io.on('connection', function(socket) {
	console.log('A user connected');

	socket.on('disconnect', function() {
		console.log('A user disconnected');
	});
});

// START THE SERVER
var server = http.listen(port, function () {
  console.log('Listening on port ' + port + '!');
});