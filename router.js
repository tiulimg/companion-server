const router = require('express').Router();
var logservices = require("./logservices");
var dbservices = require("./dbservices");
var mail = require("./mail");
var match = require("./match");

/*  "/api/couples"
*    GET: prints all couples details
*    POST: inserts new couple and finds a match
*    PATCH: insers new couple and doesn't look for a match
*    DELETE: deletes all couples
*/

router.get("/api/couples", function(req, res) {
    dbservices.getcouples(res)
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

router.post("/api/couples", function(req, res) {
    var couple = match.parsecouple(req.body);
    dbservices.insertcouple(res, couple)
    .then(() => {
        match.getbestmatch(res, couple)
        .then(bestmatches => {
            if (bestmatches.youngcouple && bestmatches.maturecouple) {
                youngcouple = bestmatches.youngcouple;
                maturecouple = bestmatches.maturecouple;
                mail.emailyoung(
                    youngcouple.email, maturecouple.email, youngcouple.name1, youngcouple.name2, maturecouple.name1, maturecouple.name2);
                mail.emailmature(
                    maturecouple.email, youngcouple.email, youngcouple.name1, youngcouple.name2, maturecouple.name1, maturecouple.name2);
                dbservices.deleteonecouple(res, youngcouple.email)
                .then(() => {
                    res.status(200).json("OK");
                })
                .catch(rejection => {
                    logservices.logRejection(rejection);
                });                   
            }
            else {
                res.status(200).json("OK");
            }
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

router.patch("/api/couples", function(req, res) {
    var couple = match.parsecouple(req.body);
    dbservices.insertcouple(res, couple)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

router.delete("/api/couples", function(req, res) {
    dbservices.deleteallcouples(res)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

/*  "/api/couples/:email"
*    DELETE: deletes one couple by email
*/

router.delete("/api/couples/:email", function(req, res) {
    dbservices.deleteonecouple(res, req.params.email)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

module.exports = router;