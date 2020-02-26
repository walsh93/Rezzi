const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const invite_users = require('../constants').invite_users
const c = require('../constants')

const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

router.get('/', checkCookie, function(request, response) {
    response.sendFile(indexFile)
  }).post('/', function(request, response){
      console.log(request.body)
      const rb = request.body

      const rezzi = request.__session.rezzi
      const emailarr = rb.emailList.split(",")
    //TO DO: figure out how to add users to channels

    //for each email in the array, need to save to the db a new user with email, role, floor, rezzi, verified = 0, and pword code

    console.log(emailarr[0] + "    " + emailarr[1])
    for(var i = 0; i < emailarr.length; i++){
        var tempPword = randomstring.generate();
        var currentEmail = emailarr[i]
        /*
        if (db.collection('users').doc(currentEmail).get()){
          console.log("EXISTS");
          continue;
        }
          TODO: Determine how to check to see if email exists
        */
        /*db.collection('users').doc(currentEmail).get().then(doc => {
          if(doc.exists){
            response.send(c.EMAIL_ALREADY_REGISTERED)
          } else {
            //put things in database*/
          db.collection('users').doc(currentEmail).set({
          email: currentEmail,
          password: tempPword,
          verified: false,
          accountType: rb.accountType,
          //floor: request.body.floor,
          rezzi: rezzi,
          //channels:
      })

      var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth:{
            user: "rezzi407@gmail.com",
            pass: "cs407Project!"
          }
        });

      var mailOptions = {
          to: currentEmail,
          from: rezzi + ' Rezzi <rezzi407@gmail.com>',
          subject: rezzi + ' Rezzi Sign-up',
          text: 'Welcome to Rezzi!\n\n' +
          'You hall director has just invited you to the ' + rezzi + 'Rezzi\n\n' +
          'To complete the set up procces and activate your account, visit http://localhost:4200/login and use the following credentials:\n\n' +
          'email: ' + currentEmail + '\n' +
          'password: ' + tempPword + '\n\n' +
          'You will be directed to set up your profile and change your password\n\n' +
          'Have fun connecting with your friends in ' + rezzi + ' this year!'
      };

      smtpTransport.sendMail(mailOptions, function(error, res) {
          if (error) {
            res.location('/invite-users').status(c.SENDING_EMAIL_ERR).render('inviteUsers',{msg: `There was an error sending email to ${currentEmail}`})
          }
      });
    }

  });

  module.exports = router
