const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const checkCookie = require("../permissions").userNeedsToBeLoggedInHD;
const indexFile = require("../constants").indexFile;
const http = require("../constants").http_status;
const keys = require("../constants").db_keys;
const invite_users = require("../constants").invite_users;
const c = require("../constants");

const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

router.get("/", checkCookie, function(request, response) {
  response.sendFile(indexFile);
}).post("/", function(request, response) {
    //data from frontend 
    const rb = request.body
    const email = rb.email
    const rezzi = rb.rezzi 
    var time = Date().toString()
    

    db.collection(keys.users).doc(email).get().then((doc) => {
        const data = doc.data()
        const password = data.password

        db.collection(keys.users).doc(email).update({
            lastEmailSent: time,
        })

        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: "rezzi407@gmail.com",
              pass: "cs407Project!"
            }
          });
    
          var mailOptions = {
            to: email,
            from: rezzi + " Rezzi <rezzi407@gmail.com>",
            subject: rezzi + " Rezzi Sign-up Reminder",
            text:
              "Hello from Rezzi!\n\nWe noticed that you hadn't accepted your invitation to the " + rezzi + " Rezzi\n\n" +
              "To complete the set up procces and activate your account, visit http://localhost:4100/sign-in and use the following credentials:\n\n" +
              "email: " + email + "\npassword: " + password + "\n\nYou will be directed to set up your profile and change your password\n\n" +
              "Have fun connecting with your friends in " + rezzi + " this year!"
          };
    
          smtpTransport.sendMail(mailOptions, function(error, res) {
            if (error) {
              console.log(`There was an error sending email to ${email}`)
            } else {
              console.log(`I think we successfully sent an email to ${email}...???!!!`)
            }
          });
    })


})

module.exports = router;