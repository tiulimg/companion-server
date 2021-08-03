var Promise = require('promise');

var dbservices = require("./dbservices");
var logservices = require("./logservices");

module.exports = {
    parsecouple: parsecouple,
    getbestmatch: getbestmatch,
}

var formParams = {
    "email": "email",
    "editlink": "editlink",
    "האם אתם זוג ותיק (מעל 5 שנים יחד) או צעיר (עד 5 שנים יחד)?":"youngormature",
    "מה השם שלך?":"name1",
    "מה השם של בן/בת זוגך?":"name2",
    "מגדר":"gender",
    "קבוצת הגיל שאתם שייכים אליה":"age",
    "איזור גיאוגרפי":"location",
    "עמדה דתית":"religion",
    "הרגלי אכילה":"eating",
    "שפה":"language",
    "השקפה פוליטית":"politics",
    "ארון":"closet",
    "רמת מיניות":"sexuality",
    "לקויות":"disability",
    "הערות":"notes",
};

var formValues = {
    "צעיר - מעוניינים בליווי זוגי": "young",
    "ותיק - מעוניינים ללוות זוגות צעירים": "mature",
    "גבר ואישה (או אישה וגבר)": "straight",
    "זוג גברים": "gays",
    "זוג נשים": "lesbians",
    "א-בינארי": "nonbinary",
}

var gridUsText = "אלה אנחנו";

function parsecouple(body) {
    var couple = {};

    for (var property in formParams) {
        if (body.hasOwnProperty(property)) {
            if (typeof couple[formParams[property]] === 'undefined' || couple[formParams[property]] == "") {
                console.log(`property: ${property} type: ${typeof(body[property])} value: ${body[property]}`);
                
                if (formValues.hasOwnProperty(body[property])) {
                    couple[formParams[property]] = formValues[body[property]];
                }
                else if (typeof(body[property]) !== "string") {
                    couple[formParams[property]] = {
                        "us": [],
                        "them": [],
                    };
                    for (let iProp = 0; iProp < body[property]["rows"].length; iProp++) {
                        const propTitle = body[property]["rows"][iProp];
                        const propValues = JSON.parse(body[property]["values"])[iProp];
                        console.log(`propTitle: ${propTitle} propValues: ${JSON.stringify(propValues)}`);
                        if (propValues == null) {
                            continue;
                        }
                        else if (propValues.length == 2) {
                            couple[formParams[property]]["us"].push(propTitle);
                            couple[formParams[property]]["them"].push(propTitle);
                        }
                        else if (propValues.includes(gridUsText)) {
                            couple[formParams[property]]["us"].push(propTitle);
                        }
                        else {
                            couple[formParams[property]]["them"].push(propTitle);
                        }
                    }
                    if (body[property]["rows"].length > 2) {
                        if (couple[formParams[property]]["us"].length == body[property]["rows"].length) {
                            couple[formParams[property]]["us"] = [];
                        }
                        if (couple[formParams[property]]["them"].length == body[property]["rows"].length) {
                            couple[formParams[property]]["them"] = [];
                        }
                    }
                }
                else {
                    couple[formParams[property]] = body[property];
                }
            }
            if (couple[formParams[property]][0] == '"') {
                couple[formParams[property]] = couple[formParams[property]].substr(1);
                couple[formParams[property]] = couple[formParams[property]].substr(0, couple[formParams[property]].length - 1);
            }
        }
    }
    console.log("couple: " + JSON.stringify(couple));
    return couple;
}

function getbestmatch(res, couple) {
    return new Promise((resolve, reject) => {
        console.log(`enter getbestmatch`);
        dbservices.getcouples(res, couple.youngormature, couple.gender)
        .then(couples => {
            console.log(`couples to match: ${JSON.stringify(couples)}`);

            bestmatch = null;
            bestmatchscore = -1;
            copycouple = JSON.parse(JSON.stringify(couple));
            delete copycouple.email;
            delete copycouple.editlink;
            delete copycouple.youngormature;
            delete copycouple.name1;
            delete copycouple.name2;
            delete copycouple.gender;
            delete copycouple.notes;
            delete copycouple._id;
            coupleeachvalue = {};
            for (var property in copycouple) {
                console.log(`property: ${property} value: ${copycouple[property]}`);
                coupleeachvalue[property] = JSON.parse(copycouple[property]);
            }
            console.log(`coupleeachvalue: ${JSON.stringify(coupleeachvalue)}`);

            for (let iCouple = 0; iCouple < couples.length; iCouple++) {
                var score = 0;
                const currcouple = couples[iCouple];
                currcoupleeachvalue = {};
                for (var property in coupleeachvalue) {
                    console.log(`property: ${property} currcoupleeachvalue: ${currcouple[property]}`);
                    currcoupleeachvalue[property] = currcouple[property];

                    const filteredArray = 
                        coupleeachvalue[property].filter(value => 
                            currcoupleeachvalue[property].includes(value));
                    console.log("filteredArray: " + JSON.stringify(filteredArray));

                    score += filteredArray.length;
                    console.log("score: " + score);
                }
                if (score > bestmatchscore) {
                    bestmatchscore = score;
                    bestmatch = currcouple;
                }
            }

            bestmatches = {};
            if (bestmatch) {
                if (couple.youngormature == "young") {
                    bestmatches.youngcouple = couple;
                    bestmatches.maturecouple = bestmatch;
                }
                else if (couple.youngormature == "mature") {
                    bestmatches.maturecouple = couple;
                    bestmatches.youngcouple = bestmatch;
                }
            }

            console.log("bestmatches: " + JSON.stringify(bestmatches));
            resolve(bestmatches);
        })
        .catch(rejection => {
            logservices.logRejection(rejection);
        });
    });
}