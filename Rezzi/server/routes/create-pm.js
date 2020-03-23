const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', checkCookie, function (request, response) {
  console.log("WORK DUMBASS");
  const req = request.body
  console.log(request.body);
  message = [];
  db.collection(keys.users).doc(request.body.from).collection(keys.private_messages).doc(request.body.to).set(
    {
      messages: message,
      title: request.body.to
    }
  )
  //if private-messages doesn't exist, create it (needs to be done in sign up)
  //create private messages in database
  db.collection(keys.users).doc(request.body.to).collection(keys.private_messages).doc(request.body.from).set(
    {
      messages: message,
      title: request.body.from
    }
  )

  response.status(200);

})


module.exports = router
