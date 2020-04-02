const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD

router.get('/', checkCookie, function (request, response) {
  db.collection('users').doc(request.__session.email).get().then((doc) => {
    let deletionRequests = doc.data().deletionRequests
    if (deletionRequests == null || deletionRequests == undefined) {
      deletionRequests = ["there are no deletion requests"]
    }
    console.log("deletion requests: " + deletionRequests)
    response.status(http.ok).json({ deletionRequests: deletionRequests })
  }).catch((error) => {
    console.log('Error deletion requests', error)
    response.status(http.conflict).json(null)
  })
});

module.exports = router;