const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedOut
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const req = request.body
  db.collection(keys.users).where(keys.email, '==', req.email).get().then((snapshot) => {
    if (snapshot.empty) {
      response.status(http.bad_request).send(sign_in.email_error)
    } else if (snapshot.docs.length == 1) {
      const data = snapshot.docs[0].data()
      if (req.password == data.password) {
        // Set session cookie before sending the response
        // TODO add other fields that need to be saved in the session
        request.__session = {
          email: req.email,
          verified: data.verified,
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
