const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const User = require('./models/user');

//** GETS **//

// WELCOME SCREEN
router.get('/', function (req, res) {
  res.render('index');
});

// REGISTER SCREEN
router.get('/register', function (req, res) {
	res.status(200).render('register');
});

// LOGIN SCREEN
router.get('/login', function (req, res) {
	res.status(200).render('login', {errors: ''});
});

// MENU SCREEN
router.get('/menu', function (req, res) {
	res.status(200).render('menu');
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
				res.status(200).redirect('/menu');
			});
		}
	);
});

//------------//


// router.get('/:id', function(req, res) {

// 	User.findById(req.params.id, function (err, user) {
// 		if (err) {
// 			return res.status(500).send("There was a problem finding the user.");
// 		}
// 		else if (!user) {
//		 	return res.status(404).send("No user found.");
//		 }
//		 res.status(200).send(user);
// 	})
// });

// router.put('/:id', function (req, res) {
	
//	 User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
//		 if (err) {
//		 	return res.status(500).send("There was a problem updating the user.");
//		 }
//		 res.status(200).send(user);
//	 });
// });

// router.delete('/:id', function (req, res) {
//	 User.findByIdAndRemove(req.params.id, function (err, user) {
//		 if (err) {
//		 	return res.status(500).send("There was a problem deleting the user.");
//		 }
//		 res.status(200).send("User " + user.username + " was deleted.");
//	 });
// });

// router.get('/', function (req, res) {
//	 User.find({}, function (err, users) {
//		 if (err) {
//		 	return res.status(500).send("There was a problem finding the users.");
//		 }
//		 res.status(200).send(users);
//	 });
// });

module.exports = router;