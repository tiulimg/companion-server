var mongoose = require("mongoose");
var Promise = require('promise');

module.exports = {
    initialize: initialize,
}

function initialize(app) {
    mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {useNewUrlParser: true});
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
        return resolve();
    });
}