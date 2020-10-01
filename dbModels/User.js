const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

let userSchema = new mongoose.Schema({
	userId: { type: String, index: true, unique: true },
	firstname: { type: String },
	lastname: { type: String },
});
userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);