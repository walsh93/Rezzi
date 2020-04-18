const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedOut
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const c = require('../constants')
const url = require('../constants').url

//Needed for mailing random code
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
    //Source: CS408 Project https://github.com/walsh93/Callback
    let responseText = "";
    const rb = request.body

    db.collection('users').doc(rb.email).get().then(doc => {
        if(!doc.exists){
            response.send(c.EMAIL_NOT_REGISTERED)
        } else {
            const token = randomstring.generate();
            db.collection('users').doc(rb.email).update({
                password: token,
                tempPword: true,
            })

            //Gmail info for Nodemailer
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth:{
                  user: "rezzi407@gmail.com",
                  pass: "cs407Project!"
                }
            });

            //Contents of the email
            var mailOptions = {
                to: rb.email,
                from: ' "Rezzi" <rezzi407@gmail.com>',
                subject: 'Rezzi Password Reset',
                text: 'A password reset has been requested for your Rezzi account.\n\n' +
                'Your temporary password is: ' + token + '\n\n' +
                'Please click on the following link to sign into Rezzi using your temporary passsword:\n\n' +
                'http://localhost:4100/pword-reset-change/ \n\n' +
                'You will be prompted to reset your password after sign in\n'
              };

            smtpTransport.sendMail(mailOptions, function(error, res) {
                if (error) {
                  response.location('/pword-reset-request').status(c.SENDING_EMAIL_ERR).render('pwordResetRequest', { msg: 'There was an error when sending the email' })
                }
            });

            response.status(http.ok).send(url.pword_reset_sent);
        }
    }).catch(err => {
        response.location('/pword-reset-request').render('pwordResetRequest', { msg: 'There was an error' })
      });
})

module.exports = router
