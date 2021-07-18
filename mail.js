module.exports = {
    emailyoung: emailyoung,
    emailmature: emailmature,
}

function emailyoung(recipient, matureemail, youngname1, youngname2, maturename1, maturename2) {
    var api_key = process.env.MAILGUN_API_KEY;
    var DOMAIN = process.env.MAILGUN_DOMAIN;
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

    var mailbody = `היי ${youngname1} ו-${youngname2} 🙂 מה שלומכם?
    
    ${maturename1} ו-${maturename2} ישמחו להקשיב לכם ולתת לכם עצות מנסיונם בנוגע ליום יום הזוגי. נראה שתמצאו הרבה במשותף.
    תוכלו ליצור איתם קשר באימייל ${matureemail}, העברנו להם גם את האימייל שלכם. בהצלחה רבה! 👍🏽

    ברגע שנמצאה התאמה, הסרנו את הפרופיל שלכם מהמערכת שלנו כדי שתראו אם הליווי הזה עובד. אם תרגישו צורך לנסות שוב תוכלו בכל כעת להרשם שוב בטופס שלנו https://docs.google.com/forms/d/1pNgAZGTjb-bFJeBNLh5K4iZyu5jwydUbAzSpPIr6bAE/viewform?edit_requested=true
    עדכנו אותנו אם הצלחתם ליצור חיבור טוב איתם ואם החיבור איתם תרם לכם. 
    
    מערכת Companion (מיזם התנדבותי חינמי)
    https://www.facebook.com/couples-companion`;
    var subject = "נמצאה התאמה לליווי זוגי בתחילת הקשר! 😎";

    var data = {
        from: 'Companion - ליווי זוגי בתחילת הקשר <tiulimg@gmail.com>',
        //to: recipient,
        to: "tiulimg@gmail.com",
        subject: subject,
        text: mailbody,
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
}

function emailmature(recipient, youngemail, youngname1, youngname2, maturename1, maturename2) {
    var api_key = process.env.MAILGUN_API_KEY;
    var DOMAIN = process.env.MAILGUN_DOMAIN;
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

    var mailbody = `היי ${maturename1} ו-${maturename2} 🙂 מה שלומכם?
    
    ${youngname1} ו-${youngname2} ישמחו לקבל מכם עצות מנסיונכם בנוגע ליום יום הזוגי. נראה שתמצאו הרבה במשותף.
    כתובת האימייל שלהם היא ${youngemail}, העברנו להם גם את האימייל שלכם והם יצרו אתכם קשר בזמנם החופשי ולפי הרגשת הלב שלהם, אין צורך שתכתבו להם ביוזמתכם. כל הכבוד לכם על ההתנדבות ובהצלחה רבה! 👍🏽

    עדכנו אותנו אם הצלחתם ליצור חיבור טוב איתם ואם החיבור איתם תרם להם או לכם. 
    
    מערכת Companion (מיזם התנדבותי חינמי)
    https://www.facebook.com/couples-companion`;
    var subject = "נמצאה התאמה לליווי זוגי בתחילת הקשר! 😎";

    var data = {
        from: 'Companion - ליווי זוגי בתחילת הקשר <tiulimg@gmail.com>',
        //to: recipient,
        to: "tiulimg@gmail.com",
        subject: subject,
        text: mailbody,
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
}