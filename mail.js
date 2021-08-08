module.exports = {
    emailyoung: emailyoung,
    emailmature: emailmature,
    emailsystem: emailsystem,
}

function emailyoung(recipient, matureemail, youngname1, youngname2, maturename1, maturename2) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    var mailbody = `היי ${youngname1} ו-${youngname2} 🙂 מה שלומכם?
    
    ${maturename1} ו-${maturename2} ישמחו להקשיב לכם ולתת לכם עצות מנסיונם בנוגע ליום יום הזוגי. נראה שתמצאו הרבה במשותף.
    תוכלו ליצור איתם קשר באימייל ${matureemail}, העברנו להם גם את האימייל שלכם. בהצלחה רבה! 👍

    ברגע שנמצאה התאמה, הסרנו את הפרופיל שלכם מהמערכת שלנו כדי שתראו אם הליווי הזה עובד. אם תרגישו צורך לנסות שוב תוכלו בכל כעת להרשם שוב בטופס שלנו https://docs.google.com/forms/d/1pNgAZGTjb-bFJeBNLh5K4iZyu5jwydUbAzSpPIr6bAE/viewform?edit_requested=true
    עדכנו אותנו אם הצלחתם ליצור חיבור טוב איתם ואם החיבור איתם תרם לכם. 
    
    מערכת Companion (מיזם התנדבותי חינמי)
    https://www.facebook.com/beginning.companion`;
    var subject = "נמצאה התאמה לליווי זוגי בתחילת הקשר! 😎";

    var data = {
        from: 'Companion - ליווי זוגי בתחילת הקשר <beginning.companion@gmail.com>',
        to: recipient,
        subject: subject,
        text: mailbody,
    };

    sgMail
    .send(data)
    .catch((error) => {
        console.error(error)
    })
}

function emailmature(recipient, youngemail, youngname1, youngname2, maturename1, maturename2) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    var mailbody = `היי ${maturename1} ו-${maturename2} 🙂 מה שלומכם?
    
    ${youngname1} ו-${youngname2} ישמחו לקבל מכם עצות מנסיונכם בנוגע ליום יום הזוגי. נראה שתמצאו הרבה במשותף.
    כתובת האימייל שלהם היא ${youngemail}, העברנו להם גם את האימייל שלכם והם יצרו אתכם קשר בזמנם החופשי ולפי הרגשת הלב שלהם, אין צורך שתכתבו להם ביוזמתכם. כל הכבוד לכם על ההתנדבות ובהצלחה רבה! 👍

    עדכנו אותנו אם הצלחתם ליצור חיבור טוב איתם ואם החיבור איתם תרם להם או לכם. 
    
    מערכת Companion (מיזם התנדבותי חינמי)
    https://www.facebook.com/beginning.companion`;
    var subject = "נמצאה התאמה לליווי זוגי בתחילת הקשר! 😎";

    var data = {
        from: 'Companion - ליווי זוגי בתחילת הקשר <beginning.companion@gmail.com>',
        to: recipient,
        subject: subject,
        text: mailbody,
    };

    sgMail
    .send(data)
    .catch((error) => {
        console.error(error)
    })
}

function emailsystem(youngemail, matureemail, youngname1, youngname2, maturename1, maturename2) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    var mailbody = `איזה יופי! 🙂
    
    נמצאה התאמה חדשה בין ${youngname1} ו-${youngname2} (${youngemail}) לבין ${maturename1} ו-${maturename2} (${matureemail}) 👍

    נאחל להם המון הצלחה ושנים רבות של אהבה! 
    
    מערכת Companion (מיזם התנדבותי חינמי)
    https://www.facebook.com/beginning.companion`;
    var subject = "נמצאה התאמה לליווי זוגי בתחילת הקשר! 😎";

    var data = {
        from: 'Companion - ליווי זוגי בתחילת הקשר <beginning.companion@gmail.com>',
        to: "beginning.companion@gmail.com",
        subject: subject,
        text: mailbody,
    };

    sgMail
    .send(data)
    .catch((error) => {
        console.error(error)
    })
}