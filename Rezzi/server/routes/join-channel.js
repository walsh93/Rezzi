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
  const channelID = req.channel_id
  console.log(req);

  // Add channel from user's channel list
  db.collection(keys.users).doc(email).update({
    channels: admin.firestore.FieldValue.arrayUnion(channelID)
  });

  // Add user to channel's member list
  if (channelID.indexOf("floors") !== -1) {
    const firstDash = channelID.indexOf('-')
    const secondDash = channelID.indexOf('-', firstDash + 1)
    const floorName = channelID.substring(firstDash + 1, secondDash)
    const channelName = channelID.substring(secondDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/floors/${floorName}/channels`
    db.collection(prefix).doc(channelName).update({
      members: admin.firestore.FieldValue.arrayUnion(email),
      memberMuteStatuses: admin.firestore.FieldValue.arrayUnion({ email: email, isMuted: false }),
    })
  } else {
    const firstDash = channelID.indexOf('-')  // The "only" dash in a hallwide channel ID
    const channelName = channelID.substring(firstDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/${req.channel_id.split('-')[0]}`
    db.collection(prefix).doc(channelName).update({
      members: admin.firestore.FieldValue.arrayUnion(email),
      memberMuteStatuses: admin.firestore.FieldValue.arrayUnion({ email: email, isMuted: false }),
    })
  }
  response.status(http.ok)
})

module.exports = router
