const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedOut
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').error.sign_in
const Passwords = require('../passwords')
const pass = new Passwords();

router.get('/', checkCookie, function (request, response) {
  response.sendFile(indexFile)
}).post('/', function (request, response) {
  const req = request.body
  req.email = req.email.toLowerCase();
  db.collection(keys.users).where(keys.email, '==', req.email).get().then((snapshot) => {
    if (snapshot.empty) {
      response.status(http.bad_request).send(sign_in.email_error)
    } else if (snapshot.docs.length == 1) {
      const data = snapshot.docs[0].data()
      //console.log(data)
      if (req.password.length < 20 || (pass.validPassword(req.password, data.password)) || ((data.verified == false || data.tempPword == true) && data.password == req.password)) { //check to see if password is valid        //TODOCONLEY ^ REMOVE THAT OTHERWISE ANYONE CAN LOG INTO AN ACCOUNT
        // TODOCONLEY ^ remove that for live environment
        // Set session cookie before sending the response
        // TODO add other fields that need to be saved in the session
        console.log(data.tempPword)
        console.log(`THE USER'S ACCOUNT TYPE IS ${data.accountType}`)
        request.__session = {
          email: req.email,
          verified: data.verified,
          tempPword: data.tempPword,
          accountType: data.accountType,
          rezzi: data.rezzi,
        }
        response.status(http.ok).json({ verified: data.verified })
      } else {
        response.status(http.bad_request).send(sign_in.password_error)
      }
    } else {
      response.send('An unhandled error occurred in the server. Please contact an administrator.');
    }
  })
})

module.exports = router
