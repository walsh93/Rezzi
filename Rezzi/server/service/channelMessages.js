// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const http = require('../constants').http_status

router.get('/', checkCookie, function(request, response) {
  db.collection(request.query.channelPath).doc(request.query.channelName).get().then((doc) => {
    if (doc.exists) {
      let messages = doc.data().messages
      if (!messages || messages == null || messages == undefined) {
        messages = []
      }
      response.status(http.ok).json({ messages: messages })
    } else {
      response.status(http.bad_request).send('Error retrieving channel messages')
    }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
