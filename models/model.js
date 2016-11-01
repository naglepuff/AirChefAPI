var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html
var mealSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, require: true},
	chef: {type: String, required: true},
	dateAdded : { type: Date, default: Date.now },
})

module.exports = mongoose.model('Meal',mealSchema);
