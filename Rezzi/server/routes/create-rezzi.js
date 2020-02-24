const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {
  const req = request.body;
  db.collection(keys.rezzis).doc(req.name).set({
    req.data
  }).then(resolve => {
    response.status(http_status.created).json({
      notification: 'rezzi created'
    });
  }).catch(reject => {
    response.status(http_status.error).json({
      notification: reject
    })
  });
})

module.exports = router