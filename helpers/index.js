var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

exports.SendVerifyAccountMail = function (host, email,id,role, cb) {
    link = "http://" + host + "/verifyaccount/" + id+"/"+role;
    mailOptions = {
        to: email,
        subject: "[Tutor] Verify Account",
        html: "Hello,<br> Please click on the link to verify your account.<br><a href=" + link + ">Click here</a>."
    }
    console.log(mailOptions);
    console.log(smtpTransport.auth);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            cb(error);
        } else {
            console.log("Message sent: " + response.toString());
            cb(null, token);
        }
    });
}

exports.forgotPassword = function ( email,code,cb) {
    mailOptions = {
        to: email,
        subject: "[Tutor] Forgot Password",
        html: "Hello,<br> Please enter <b>"+code+"</b> to change your password."
    }
    console.log(mailOptions);
    console.log(smtpTransport.auth);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            cb(error);
        } else {
            console.log("Message sent: " + response.toString());
            cb(null, token);
        }
    });
}