const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD

router.get('/', checkCookie, function (request, response) {
  db.collection('users').doc(request.__session.email).get().then((doc) => {
    let reportedMessages = doc.data().reportedMessages
    if (reportedMessages == null || reportedMessages == undefined) {
      reportedMessages = ["there are no reported messages"]
    }
    console.log("reported messages", reportedMessages)
    response.status(http.ok).json({ reportedMessages: reportedMessages })
  }).catch((error) => {
    console.log('Error reported messages', error)
    response.status(http.conflict).json(null)
  })
});

module.exports = router;
