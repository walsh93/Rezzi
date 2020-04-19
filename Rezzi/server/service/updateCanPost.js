const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys
const checkCookie = require('../permissions').userNeedsToBeLoggedInAdmin

router.get('/', checkCookie, function (request, response) {
  db.collection(keys.users).doc(request.query.user).update({
    canPost: (request.query.canPost == 'true')
  }).then((result) => {
    response.status(http.ok).json({ status: http.ok });
  }).catch((err) => {
    console.log('Error setting accountType', err)
    response.status(http.error).json({ status: http.error });
  })
});

module.exports = router;
