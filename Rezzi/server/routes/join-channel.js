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
  if (req.channel_id.indexOf("floors") !== -1) {
    db.collection(keys.rezzis + '/' + rezzi + '/floors/' + req.channel_id.split('-')[1] + '/channels')
      .doc(req.channel_id.split('-')[2])
      .update({
        members: admin.firestore.FieldValue.arrayUnion(email)
    })
  }
  else {
    db.collection(keys.rezzis + '/' + rezzi + '/' + req.channel_id.split('-')[0])
      .doc(req.channel_id.split('-')[1])
      .update({
        members: admin.firestore.FieldValue.arrayUnion(email)
    })
  }
  response.status(http.ok)
})

module.exports = router
