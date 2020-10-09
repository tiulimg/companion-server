const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const timestamps = require('mongoose-timestamp');

let userSchema = new mongoose.Schema({
	username: { type: String, },
	password: { type: String },
});
userSchema.plugin(timestamps);
UserSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('User', userSchema);