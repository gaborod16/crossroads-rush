var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	username: {type: String, index: true, unique: true},
	password: String,
	maps: {type: [Number], default: []}
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');