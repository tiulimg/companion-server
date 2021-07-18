const router = require('express').Router();
var logservices = require("./logservices");
var dbservices = require("./dbservices");

/*  "/api/couples"
*    GET: prints all couples details
*    POST: inserts new couple
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
    var couple = req.body;
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