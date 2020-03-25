const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInRA

router.get('/', checkCookie, function (request, response) {
  db.collection('users').doc(request.__session.email).get().then((doc) => {
    let channelRequests = doc.data().channelRequests
    if (channelRequests == null || channelRequests == undefined) {
      channelRequests = []
    }
    response.status(http.ok).json({ channelRequests: channelRequests })
  }).catch((error) => {
    console.log('Error getting RA document', error)
    response.status(http.conflict).json(null)
  })
});

module.exports = router;
