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
      response.status(http.ok).json(doc.data())
    } else {
      // Remove channel ID from request list if it's no longer in database
      const raDocRef = db.collection('users').doc(request.__session.email)
      raDocRef.get().then((raDoc) => {
        const chanReqs = raDoc.data().channelRequests
        chanReqs.splice(request.query.index, 1)
        raDocRef.update({
          channelRequests: chanReqs
        })
      })

      // Send response without waiting for raDoc update to complete
      response.status(http.bad_request).json(null)
    }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
