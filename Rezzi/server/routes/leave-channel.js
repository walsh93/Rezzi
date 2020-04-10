const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  const rezzi = request.__session.rezzi;
  const channelID = req.channel_id
  console.log(req);

  // Promise array
  let promises = []

  // Remove channel from user's channel list
  let userDocPromise = db.collection(keys.users).doc(email).update({
    channels: admin.firestore.FieldValue.arrayRemove(channelID)
  });
  promises.push(userDocPromise)

  // Remove user from channel's member list
  if (channelID.indexOf("floors") !== -1) {
    const firstDash = channelID.indexOf('-')
    const secondDash = channelID.indexOf('-', firstDash + 1)
    const floorName = channelID.substring(firstDash + 1, secondDash)
    const channelName = channelID.substring(secondDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/floors/${floorName}/channels`
    const floorChannelDocRef = db.collection(prefix).doc(channelName)
    let promise = floorChannelDocRef.get().then(floorChannelDoc => {
      const memberMuteStatuses = floorChannelDoc.data().memberMuteStatuses
      const updatedMuteStatuses = []
      for (let i = 0; i < memberMuteStatuses.length; i++) {
        if (memberMuteStatuses[i].email != email) {
          updatedMuteStatuses.push(memberMuteStatuses[i])
        }
      }
      return floorChannelDocRef.update({
        members: admin.firestore.FieldValue.arrayRemove(email),
        memberMuteStatuses: updatedMuteStatuses
      })
    })
    promises.push(promise)
  } else {
    const firstDash = channelID.indexOf('-')  // The "only" dash in a hallwide channel ID
    const channelName = channelID.substring(firstDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/${req.channel_id.split('-')[0]}`
    const hallChannelDocRef = db.collection(prefix).doc(channelName)
    let promise = hallChannelDocRef.get().then(hallChannelDoc => {
      const memberMuteStatuses = hallChannelDoc.data().memberMuteStatuses
      const updatedMuteStatuses = []
      for (let i = 0; i < memberMuteStatuses.length; i++) {
        if (memberMuteStatuses[i].email != email) {
          updatedMuteStatuses.push(memberMuteStatuses[i])
        }
      }
      return hallChannelDocRef.update({
        members: admin.firestore.FieldValue.arrayRemove(email),
        memberMuteStatuses: updatedMuteStatuses
      })
    })
    promises.push(promise)
  }

  // Send response when all promises are completed
  Promise.all(promises).then((resolved) => {
    response.status(http.ok).json({ resolved, msg: 'User has left the chat' })
  }).catch((reject) => {
    response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
  })
})

module.exports = router
