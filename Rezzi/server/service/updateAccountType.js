const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {

  db.collection(keys.users).doc(request.query.user).update({
    accountType: request.query.accountType
  }).catch((err) => {
    console.log('Error setting accountType', err)
    response.status(http.error).json(null)
  })
});

module.exports = router;
