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
        dbservices.getmatches(res)
        .then(matches => {
            pastmatches = {};
            matches.forEach(pastmatch => {
                pastmatches[`${pastmatch.emailyoung}_-^-_${pastmatch.emailmature}`] = "Been matched"
            });

            dbservices.getcouples(res, couple.youngormature, couple.gender)
            .then(couples => {
                console.log(`couples to match: ${JSON.stringify(couples)}`);
    
                copycouple = JSON.parse(JSON.stringify(couple));
    
                bestmatch = null;
                bestmatchscore = -1;
                delete copycouple.email;
                delete copycouple.editlink;
                delete copycouple.youngormature;
                delete copycouple.name1;
                delete copycouple.name2;
                delete copycouple.gender;
                delete copycouple.notes;
                delete copycouple._id;
    
                for (let iCouple = 0; iCouple < couples.length; iCouple++) {
                    var score = 0;
                    var currcouple = couples[iCouple];
                    if (pastmatches[`${couple.email}_-^-_${currcouple.email}`] ||
                        pastmatches[`${currcouple.email}_-^-_${couple.email}`]) {
                        console.log(`${couple.email} already matched with ${currcouple.email} in the past, skipping...`);
                        continue;
                    }
                    var skip = false;
                    for (var property in copycouple) {
                        console.log(`property: ${property} currcouple: ${JSON.stringify(currcouple[property])} couple: ${JSON.stringify(couple[property])}`);
    
                        var oneway = ["no requirement"]; 
                        var otherway = ["no requirement"]; 
                        var optionaloneway = []; 
                        var optionalotherway = []; 
                        if (couple[property] && couple[property]["them"] && couple[property]["them"].length > 0) {
                            oneway =
                                couple[property]["them"].filter(value => 
                                    currcouple[property] && currcouple[property]["us"] && 
                                    currcouple[property]["us"].includes(value));
                        }
                        if (currcouple[property] && currcouple[property]["them"] && currcouple[property]["them"].length > 0) {
                            otherway = 
                                currcouple[property]["them"].filter(value => 
                                    couple[property] && couple[property]["us"] && 
                                    couple[property]["us"].includes(value));
                        }
                        if (couple[property] && couple[property]["us"]) {
                            optionaloneway =
                                couple[property]["us"].filter(value => 
                                    currcouple[property] && currcouple[property]["us"] && 
                                    currcouple[property]["us"].includes(value));
                        }
                        if (currcouple[property] && currcouple[property]["us"]) {
                            optionalotherway = 
                                currcouple[property]["us"].filter(value => 
                                    couple[property] && couple[property]["us"] && 
                                    couple[property]["us"].includes(value));
                        }
    
                        console.log("oneway: " + JSON.stringify(oneway));
                        console.log("otherway: " + JSON.stringify(otherway));
                        console.log("optionaloneway: " + JSON.stringify(optionaloneway));
                        console.log("optionalotherway: " + JSON.stringify(optionalotherway));
    
                        if (oneway.length == 0 || otherway.length == 0) {
                            skip = true;
                            break;
                        }
    
                        score += optionaloneway.length;
                        score += optionalotherway.length;
                        console.log("score: " + score);
                    }
                    if (!skip && score > bestmatchscore) {
                        bestmatchscore = score;
                        bestmatch = couples[iCouple];
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
        })
       .catch(rejection => {
            logservices.logRejection(rejection);
        });
    });
}