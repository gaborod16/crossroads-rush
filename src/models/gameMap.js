var mongoose = require('mongoose');

var GameMapSchema = new mongoose.Schema({
	name: {type: String, index: true, unique: true},
	owner: String,
	size: {
		height: {type: Number, default: 10}, 
		width: Number
	},
	config: {sheepSpeed: Number, nLives: Number},
	text: [mongoose.Schema.Types.Mixed]
});

mongoose.model('GameMap', GameMapSchema);

module.exports = mongoose.model('GameMap');