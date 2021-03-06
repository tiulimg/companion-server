const mongoose = require('mongoose');

let blackListSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
});

module.exports = mongoose.model('BlackList', blackListSchema);