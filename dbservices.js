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
    insertmatch: insertmatch,
    deleteonematch: deleteonematch,
    deleteallmatches: deleteallmatches,
    getblacklist: getblacklist,
    insertblacklist: insertblacklist,
    deleteoneblacklist: deleteoneblacklist,
    deleteallblacklist: deleteallblacklist,
}

var db;

var COUPLES_COLLECTION = "couples";
var MATCHES_COLLECTION = "matches";
var BLACKLIST_COLLECTION = "blacklist";

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

function getcouples(res, youngormature = null, gender = null) {
    return new Promise((resolve, reject) => {
        var filter = [];
        if (youngormature) {
            filter.push({youngormature: { $not: {$regex: `${youngormature}`} } });
        }
        if (gender) {
            filter.push({gender: gender});
        }
        db.collection(COUPLES_COLLECTION).find({$and: filter}).toArray(function(err, docs) {
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
        deleteonecouple(res, couple.email)
        .then(() => {
            db.collection(COUPLES_COLLECTION).insertOne(couple, function(err, doc) {
                if (err) {
                    logservices.handleError(res, err.message, "Failed to create or update couple.");
                }
                else {
                    return resolve(doc);
                }
            });
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
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

function getmatches(res) {
    return new Promise((resolve, reject) => {
        db.collection(MATCHES_COLLECTION).find({}).toArray(function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to get all matches.");
            } else {
                return resolve(docs);
            }
        });
    });
}

function insertmatch(res, match) {
    return new Promise((resolve, reject) => {
        deleteonematch(res, match.emailyoung, match.emailmature)
        .then(() => {
            db.collection(MATCHES_COLLECTION).insertOne(match, function(err, doc) {
                if (err) {
                    logservices.handleError(res, err.message, "Failed to create or update match.");
                }
                else {
                    return resolve(doc);
                }
            });
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    });
}

function deleteonematch(res, emailyoung, emailmature) {
    return new Promise((resolve, reject) => {
        db.collection(MATCHES_COLLECTION).deleteOne(
            { emailyoung: emailyoung.toLowerCase(), emailmature: emailmature.toLowerCase() }, function(err, doc) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete match");
            }
            return resolve();
        });
    });
}

function deleteallmatches(res) {
    return new Promise((resolve, reject) => {
        db.collection(MATCHES_COLLECTION).deleteMany({}, function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete all matches.");
            } else {
                return resolve();
            }
        });
    });
}

function getblacklist(res, email) {
    return new Promise((resolve, reject) => {
        db.collection(BLACKLIST_COLLECTION).find({email: email.toLowerCase()}).toArray(function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to get blacklist.");
            } else {
                return resolve(docs);
            }
        });
    });
}

function insertblacklist(res, blacklist) {
    return new Promise((resolve, reject) => {
        deleteoneblacklist(res, blacklist.email)
        .then(() => {
            db.collection(BLACKLIST_COLLECTION).insertOne(blacklist, function(err, doc) {
                if (err) {
                    logservices.handleError(res, err.message, "Failed to create or update blacklist.");
                }
                else {
                    return resolve(doc);
                }
            });
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    });
}

function deleteoneblacklist(res, email) {
    return new Promise((resolve, reject) => {
        db.collection(BLACKLIST_COLLECTION).deleteOne(
            { email: email.toLowerCase() }, function(err, doc) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete blacklist");
            }
            return resolve();
        });
    });
}

function deleteallblacklist(res) {
    return new Promise((resolve, reject) => {
        db.collection(BLACKLIST_COLLECTION).deleteMany({}, function(err, docs) {
            if (err) {
                logservices.handleError(res, err.message, "Failed to delete all blacklist.");
            } else {
                return resolve();
            }
        });
    });
}