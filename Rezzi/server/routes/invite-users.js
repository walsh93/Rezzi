const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const invite_users = require('../constants').invite_users

const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

//TODO: user needs to be logged in as admin
router.get('/', checkCookie, function(request, response) {
    response.sendFile(indexFile)
  }).post('/', function(request, response){
      console.log(request.body)
    

    //not sure what things I need to make sure are happening here
    //for each email in the array, need to save to the db a new user with email, role, floor, rezzi, verified = 0, and pword code

    //loop through array (how do I get that??)
    for(var i = 0, i < request.body.emailarr.length; i++){
        //if(email isn't already in the database)
        const tempPword = randomstring.generate();
        var currentEmail = request.body.emailarr[i]
        //put things in database
        db.collection(request.__session.dbCollection).add({
            email: currentEmail,
            password: tempPword,
            verified: 'false',
            //accountType: request.body.rezzi,
            //floor: request.body.floor,
            //rezzi: request.body.rezzi,
            //channels: request.body.channels,
        }).then(() =>{
            response.status(http.ok).send('Add user sucessful') 
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
            from: request.body.rezi + ' Rezzi <rezzi407@gmail.com',
            subject: request.body.rezi + ' Rezzi Sign-up',
            text: 'Welcome to Rezzi!\n\n' +
            'You hall director has just invited you to the ' + request.body.rezzi + 'Rezzi\n\n' +
            'To complete the set up procces and activate your account, visit http://localhost:4200/login and use the following credentials:\n\n' +
            'email: ' + currentEmail + '\n' +
            'password: ' + tempPword + '\n\n' +
            'You will be directed to set up your profile and change your password\n\n' +
            'Have fun connecting with your friends in ' + request.body.rezzi + ' this year!'
        };

        smtpTransport.sendMail(mailOptions, function(error, res) {
            if (error) {
              return response.status(c.HTTP_INTERNAL_ERR).send(`An error occured when sending an email to ${currentEmail}`);
            }
          });
    
    }
    
  });

  module.exports = router