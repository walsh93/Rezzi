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
  response.sendFile(indexFile)
}).post('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  const rezzi = request.__session.rezzi;
  console.log(req);
  db.collection(keys.users).doc(email).update({
    channels: admin.firestore.FieldValue.arrayUnion(req.channel_id)
  });
  db.collection(keys.rezzis).doc()
  response.status(http.ok)
})

module.exports = router
