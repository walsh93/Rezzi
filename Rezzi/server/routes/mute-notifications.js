const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const FieldValue = require('firebase-admin').firestore.FieldValue;

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function (request, response) {
  response.sendFile(indexFile)
}).post('/', function (request, response) {
  const rb = request.body;
  const channel = rb.channel;
  const email = request.__session.email;

  //console.log(email, toDismiss, channel)

  db.collection(keys.users).doc(email).collection("Notifications").doc(channel).get().then((doc) => {
      data = doc.data()
      db.collection(keys.users).doc(email).collection("Notifications").doc(channel).update({ 'muted': !data.muted })
  }).catch((error) => {
    response.status(http.bad_request).json({ error: error, msg: 'Something went wrong muting notifications' })
  })

  response.status(http.ok).send('Mute status updated')
})


module.exports = router;
