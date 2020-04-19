const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', checkCookie, function(request, response) {
  const email = request.body.email
  const newFloor = request.body.newFloor

  // Promise array
  let promises = []

  const userDocRef = db.collection(keys.users).doc(email)
  userDocRef.get().then(userDoc => {
    const userData = userDoc.data()
    const floorPrefix = keys.rezzis + '/' + userData.rezzi + '/floors'
    const oldFloorDocRef = db.collection(floorPrefix).doc(userData.floor)
    const newFloorDocRef = db.collection(floorPrefix).doc(newFloor)

    // Remove user from list of floor.residents array
    promises.push(oldFloorDocRef.update({
      residents: admin.firestore.FieldValue.arrayRemove(email)
    }))

    // If RA, remove from list of floor.ras array
    if (userData.accountType == 1) {
      promises.push(oldFloorDocRef.update({
        ras: admin.firestore.FieldValue.arrayRemove(email)
      }))
    }

    // Remove user from floor-specific chat members and mute statuses lists
    const updatedUserChannels = []  // Keep all non-floor channels
    const userChannels = userData.channels
    for (let i = 0; i < userChannels.length; i++) {
      const channelID = userChannels[i]
      if (channelID.indexOf("floors") !== -1) {
        const firstDash = channelID.indexOf('-')
        const secondDash = channelID.indexOf('-', firstDash + 1)
        const channelName = channelID.substring(secondDash + 1)
        const oldFloorChannelDocRef = oldFloorDocRef.collection('channels').doc(channelName)
        promises.push(oldFloorChannelDocRef.get().then(oldFloorChannelDoc => {
          const memberMuteStatuses = oldFloorChannelDoc.data().memberMuteStatuses
          const updatedMuteStatuses = []
          for (let i = 0; i < memberMuteStatuses.length; i++) {
            if (memberMuteStatuses[i].email != email) {
              updatedMuteStatuses.push(memberMuteStatuses[i])
            }
          }
          return oldFloorChannelDocRef.update({
            members: admin.firestore.FieldValue.arrayRemove(email),
            memberMuteStatuses: updatedMuteStatuses
          })
        }))
      } else {  // it's hallwide or RA, we want to keep those
        updatedUserChannels.push(channelID)
      }
    }

    // Add general channel for new floor to user's channel list
    updatedUserChannels.push(`floors-${newFloor}-General`)

    // Change floor and update channel list in user document
    promises.push(userDocRef.update({
      channels: updatedUserChannels,
      floor: newFloor
    }))

    // Add user to list of newFloor.residents array
    promises.push(newFloorDocRef.update({
      residents: admin.firestore.FieldValue.arrayUnion(email)
    }))

    // If RA, add to list of newfloor.ras array
    if (userData.accountType == 1) {
      promises.push(newFloorDocRef.update({
        ras: admin.firestore.FieldValue.arrayUnion(email)
      }))
    }

    // Add user to new floor general chat list of members and mute statuses
    promises.push(newFloorDocRef.collection('channels').doc('General').update({
      members: admin.firestore.FieldValue.arrayUnion(email),
      memberMuteStatuses: admin.firestore.FieldValue.arrayUnion({ email: email, isMuted: false })
    }))

    // Send response when all promises are completed
    Promise.all(promises).then((resolved) => {
      response.status(http.ok).json({ resolved, status: http.ok, msg: 'User has been moved' })
    }).catch((reject) => {
      response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
    })
  }).catch((error) => {
    response.status(http.bad_request).json({ error: error, msg: 'Something went wrong. Please try again later.' })
  })
})

module.exports = router;
