const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const timestamps = require('mongoose-timestamp');

let userSchema = new mongoose.Schema({
	username: { type: String, unique: true },
	password: { type: String },
});
userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);