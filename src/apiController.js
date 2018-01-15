const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('./models/user');
const GameMap = require('./models/gameMap');

//** SESSION FUNCTIONS **//

function createSession(req, res, user) {
	req.session.username = user.username;
	console.log('User ' + req.session.username + ' logged in!');
};

function verifySession(req, res, callback) {
	if (req.session.username == null) {
		res.redirect('/');
	}
	else {
		callback(req, res);
	}
};

function hasSession(req, res, callback) {
	if (req.session.username != null) {
		res.redirect('menu');
	}
	else {
		callback(req, res);
	}
};

function deleteSession(req, res) {
	console.log('User ' + req.session.username + ' logged out!');
	req.session.destroy(function(err) {
		if (err) {
			res.negotiate(err);
		}
		res.redirect('/');
	});
};

//------------//

//** GETS **//

// WELCOME SCREEN
router.get('/', function (req, res) {
	hasSession(req, res, 
		function (req, res) {
			res.render('index');
		}
	);
});

// REGISTER SCREEN
router.get('/register', function (req, res) {
	hasSession(req, res, 
		function (req, res) {
			res.status(200).render('register');
		}
	);
});

// LOGIN SCREEN
router.get('/login', function (req, res) {
	hasSession(req, res, 
		function (req, res) {
			res.status(200).render('login', {errors: ''});
		}
	);
});

// MENU SCREEN
router.get('/menu', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			res.status(200).render('menu', {username: req.session.username});
		}
	);
});

// MAIN MENU SCREEN
router.get('/menu/main', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			res.status(200).render('main_menu');
		}
	);
});

// MAPS MENU SCREEN
router.get('/menu/maps', function (req, res) {
	verifySession(req, res, 
		function(req, res) {
			GameMap.find(
				{
					owner: req.session.username
				},
				function (err, maps) {
					res.status(200).render('map_menu', {maps: maps});
				}
			);
		}
	);
});

// MAP CREATOR SCREEN
router.get('/map_creator', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			if (!req.query.mapname) {
				res.status(200).render('map_creator');
			}
			else {
				console.log(req.query.mapname);
				GameMap.findOne(
					{
						name: req.query.mapname
					},
					function (err, map) {
						res.status(200).render('map_creator', {
							mapname: map.name, 
							blueprint: JSON.stringify(map.blueprint)
						});
					}
				);
			}
		}
	);
});

// PLAY OFFLINE MENU SCREEN
router.get('/menu/play_offline', function (req, res) {
	verifySession(req, res, 
		function(req, res) {
			GameMap.find(
				{
					owner: req.session.username
				},
				function (err, maps) {
					res.status(200).render('play_offline_menu', {maps: maps});
				}
			);
		}
	);
});

// GAME SCREEN
router.get('/game', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			if (req.query.mapname) {
				console.log('Playing: ' + req.query.mapname);
				GameMap.findOne(
					{
						name: req.query.mapname
					},
					function (err, map) {
						res.status(200).render('game_play', {
							mapname: map.name,
							blueprint: JSON.stringify(map.blueprint)
						});
					}
				);
			}
		}
	);
});

// GET USER'S MAPS
router.get('/user/maps', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			GameMap.find(
				{
					owner: req.session.username
				},
				function (err, maps) {
					res.status(200).send(maps);
				}
			);
		}
	);
});

//------------//

//** POSTS **//

// HANDLES THE CREATION OF A MAP
router.post('/user/map/new', function (req, res) {
	verifySession(req, res, 
		function (req, res) {
			GameMap.create({
				name: req.body.mapname,
				owner: req.session.username,
				blueprint: JSON.parse(req.body.blueprint)
			},
			function (err, gameMap) {
				if (err || gameMap == null) {
					console.log(err);
					return res.status(500).send("There was a problem creating the map: " + err);
				}
				console.log("Map created successfully!");
				res.status(200).redirect('/menu');
			});
		}
	);
});

// HANDLE REGISTER
router.post('/register', function (req, res) {
	User.findOne(
		{
			username: req.body.username
		},
		function (err, user) {
			if (user != null) {
				return res.status(500).render('register', {errors: "The username was already taken."});
			}

			bcrypt.hash(req.body.password, 10, function(err, hash) {
				if (err) {
					return res.status(500).render('register', {errors: "There was a problem with your password."});
				}
				User.create({
					username : req.body.username,
					password : hash
				}, 
				function (err, user) {
					if (err || user == null) {
						return res.status(500).render('register', {errors: "There was a problem creating the user."});
					}
					createSession(req, res, user);
					res.status(200).redirect('/menu');
				});
			});
		}
	);	
});

// HANDLE LOGIN
router.post('/login', function (req, res) {
	User.findOne(
		{
			username: req.body.username
		}, 
		function (err, user) {
			if (err || user == null) {
				return res.status(500).render('login', {errors: "Username doesn't exists."});
			}
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if(err) {
					return res.status(500).render('login', {errors: "Wrong password."});
				}
				createSession(req, res, user);
				res.status(200).redirect('/menu');
			});
		}
	);
});

// HANDLE LOGOUT
router.post('/logout', function (req, res) {
	deleteSession(req, res);
});

//------------//

module.exports = router;