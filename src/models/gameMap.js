var mongoose = require('mongoose');

var GameMapSchema = new mongoose.Schema({
	name: {type: String, index: true, unique: true},
	owner: String,
	blueprint: [mongoose.Schema.Types.Mixed]
});

mongoose.model('GameMap', GameMapSchema);

module.exports = mongoose.model('GameMap');