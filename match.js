var Promise = require('promise');

var dbservices = require("./dbservices");

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
};

formValues = {
    "צעיר - מעוניינים בליווי זוגי": "young",
    "ותיק - מעוניינים ללוות זוגות צעירים": "mature",
    "גבר ואישה (או אישה וגבר)": "straight",
    "זוג גברים": "gays",
    "זוג נשים": "lesbians",
    "א-בינארי": "nonbinary",
}

function parsecouple(body) {
    var couple = {};

    for (var property in formParams) {
        if (body.hasOwnProperty(property)) {
            if (typeof couple[formParams[property]] === 'undefined' || couple[formParams[property]] == "") {
                if (formValues.hasOwnProperty(body[property])) {
                    couple[formParams[property]] = formValues[body[property]];
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
        dbservices.getcouples(res, couple.youngormature, couple.gender)
        .then(couples => {
            bestmatch = null;
            bestmatchscore = 0;
            copycouple = JSON.parse(JSON.stringify(couple));
            delete copycouple.email;
            delete copycouple.editlink;
            delete copycouple.youngormature;
            delete copycouple.name1;
            delete copycouple.name2;
            coupleeachvalue = {};
            for (var property in copycouple) {
                coupleeachvalue[property] = copycouple.split(", "); 
            }
            console.log("coupleeachvalue: " + JSON.stringify(coupleeachvalue));

            for (let iCouple = 0; iCouple < couples.length; iCouple++) {
                var score = 0;
                const currcouple = couples[iCouple];
                currcoupleeachvalue = {};
                for (var property in copycouple) {
                    currcoupleeachvalue[property] = copycouple.split(", ");
                    console.log(`property: ${property} currcoupleeachvalue: currcoupleeachvalue[property]`);

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