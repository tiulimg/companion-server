var mongodb = require("mongodb");
var Promise = require('promise');

var logservices = require("./logservices");

module.exports = {
    initialize: initialize,
    getcouples: getcouples,
    insertcouple: insertcouple,
    deleteonecouple: deleteonecouple,
    deleteallcouples: deleteallcouples,
    getmatches: getmatches,
}

var db;

var COUPLES_COLLECTION = "couples";

function initialize(app) {
    return new Promise((resolve, reject) => {
        // Connect to the database before starting the application server.
        var mongoClient = new mongodb.MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/test",{ useUnifiedTopology: true });
        mongoClient.connect(function (err, client) {
            if (err) {
                console.log(err);
                process.exit(1);
            }

            // Save database object from the callback for reuse.
            db = client.db();
            console.log("Database connection ready");

            // Initialize the app.
            var server = app.listen(process.env.PORT || 8080, function () {
                var port = server.address().port;
                console.log("App now running on port", port);
                return resolve();
            });
        });
    });
}

function getcouples(res) {
    return new Promise((resolve, reject) => {
        db.collection(COUPLES_COLLECTION).find({}).toArray(function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to get couples.");
            } else {
                return resolve(docs);
            }
        });
    });
}

function insertcouple(res, couple) {
    return new Promise((resolve, reject) => {
        db.collection(COUPLES_COLLECTION).insertOne(couple, function(err, doc) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to create new couple.");
            }
            else {
                return resolve();
            }
        });
    });
}

function deleteonecouple(res, email) {
    return new Promise((resolve, reject) => {
        db.collection(COUPLES_COLLECTION).deleteOne(
            { email: email.toLowerCase() }, function(err, doc) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete couple");
            }
            return resolve();
        });
    });
}

function deleteallcouples(res) {
    return new Promise((resolve, reject) => {
        db.collection(COUPLES_COLLECTION).deleteMany({}, function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete all couples.");
            } else {
                return resolve();
            }
        });
    });
}

function getmatches(res, filters) {
    return new Promise((resolve, reject) => {
        var filter = {}
        db.collection(COUPLES_COLLECTION).find(filter, function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to get matches.");
            } else {
                return resolve();
            }
        });
    });
}