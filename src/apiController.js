const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('./models/user');

//** SESSION FUNCTIONS **//

function createSession(req, res, user) {
	req.session.username = user.username;
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
			res.status(200).render('menu');
		}
	);
});

//------------//

//** POSTS **//

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

//------------//

module.exports = router;