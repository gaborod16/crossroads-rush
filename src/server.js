
// IMPORTS
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

// STATIC PATHS
app.use('/js', express.static(path.join(__dirname, '/public/js/')));
app.use('/css', express.static(path.join(__dirname, '/public/css/')));
app.use('/assets', express.static(path.join(__dirname, '/public/assets/')));
app.use('/bower', express.static(path.join(__dirname, '/public/bower_components/')));
app.use('/classes', express.static(path.join(__dirname, '/public/js/models')));

// SETUP PUG TEMPLATES
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// CONFIGURE APP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'crimsom', resave: false, saveUninitialized: false}));

// USE API CONTROLLER
var ApiController = require('./apiController');
app.use('/', ApiController);



// BEGIN THE SOCKET COMMUNICATION (MOVE FROM HERE)
// io.on('connection', function(socket) {
// 	console.log('A user connected');

// 	socket.on('disconnect', function() {
// 		console.log('A user disconnected');
// 	});
// });

// START THE SERVER
var server = http.listen(port, function () {
  console.log('Listening on port ' + port + '!');
});