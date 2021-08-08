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
    dbservices.getblacklist(res, couple.email)
    .then(blacklist => {
        if (blacklist) {
            res.status(200).json(`This couple is blacklisted ${couple.email}`);
        }
        else {
            dbservices.insertcouple(res, couple)
            .then(() => {
                console.log(`b4matches`);
                match.getbestmatch(res, couple)
                .then(bestmatches => {
                    if (bestmatches.youngcouple && bestmatches.maturecouple) {
                        console.log(`have young mature`);
                        youngcouple = bestmatches.youngcouple;
                        maturecouple = bestmatches.maturecouple;
                        mail.emailyoung(
                            youngcouple.email, maturecouple.email, youngcouple.name1, youngcouple.name2, maturecouple.name1, maturecouple.name2);
                        mail.emailmature(
                            maturecouple.email, youngcouple.email, youngcouple.name1, youngcouple.name2, maturecouple.name1, maturecouple.name2);
                        mail.emailsystem(
                            youngcouple.email, maturecouple.email, youngcouple.name1, youngcouple.name2, maturecouple.name1, maturecouple.name2);
                        console.log(`emailed`);
                        dbservices.insertmatch(res, {
                            emailyoung: youngcouple.email,
                            emailmature: maturecouple.email,
                        })
                        .then(() => {
                            dbservices.deleteonecouple(res, youngcouple.email)
                            .then(() => {
                                res.status(200).json("OK");
                            })
                            .catch(rejection => {
                                logservices.logRejection(rejection);
                            });                   
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
        }
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

/*  "/api/matches"
*    GET: prints all matches
*    POST: inserts new match
*    DELETE: deletes all matches
*/

router.get("/api/matches", function(req, res) {
    dbservices.getmatches(res)
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

router.post("/api/matches", function(req, res) {
    var match = req.body;
    if (match.hasOwnProperty("emailyoung") && match.hasOwnProperty("emailmature")) {
        dbservices.insertmatch(res, match)
        .then(() => {
            res.status(200).json("OK");
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    }
    else {
        res.status(200).json("Match doesn't contain emailyoung or emailmature");
    }
});

router.delete("/api/matches", function(req, res) {
    dbservices.deleteallmatches(res)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

/*  "/api/matches/:emailyoung&:emailmature"
*    DELETE: deletes one match by emailyoungh and emailmature
*/

router.delete("/api/matches/:emailyoung&:emailmature", function(req, res) {
    dbservices.deleteonematch(res, req.params.emailyoung, req.params.emailmature)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

/*  "/api/blacklist"
*    GET: prints all blacklist
*    POST: inserts new blacklist
*    DELETE: deletes all blacklist
*/

router.get("/api/blacklist", function(req, res) {
    dbservices.getblacklist(res)
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

router.post("/api/blacklist", function(req, res) {
    var blacklist = req.body;
    if (match.hasOwnProperty("email")) {
        dbservices.insertmatch(res, blacklist)
        .then(() => {
            res.status(200).json("OK");
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    }
    else {
        res.status(200).json("Blacklist doesn't contain email");
    }
});

router.delete("/api/blacklist", function(req, res) {
    dbservices.deleteallblacklist(res)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

/*  "/api/matches/:email"
*    DELETE: deletes one blacklist by email
*/

router.delete("/api/blacklist/:email", function(req, res) {
    dbservices.deleteoneblacklist(res, req.params.email)
    .then(() => {
        res.status(200).json("OK");
    })
    .catch(rejection => {
        logservices.logRejection(rejection);
    });
});

module.exports = router;