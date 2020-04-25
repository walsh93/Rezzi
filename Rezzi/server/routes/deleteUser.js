const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', function(request, response) {
  // Data from request body (frontend)
  const rb = request.body
  const email = rb.email
  const rezzi = rb.rezzi
  const hdemail = rb.hdemail

  // Firebase doc references
  const deleteRef = db.collection(keys.users).doc(email)
  const rezziRef = db.collection(keys.rezzis).doc(rezzi)
  const hdDocRef = db.collection(keys.users).doc(hdemail)

  // Promise array
  let promises = []

  deleteRef.get().then((docToDelete) => {
    const data = docToDelete.data()
    const role = data.accountType
    const floor = data.floor
    const floorDocRef = db.collection(keys.rezzis + '/' + rezzi + '/floors').doc(floor)


    /**
     * if RA; else resident
     * Remove from Rezzi list of (user type)s and floor list of (user type)s
     * Note: RAs are in floors 'ras' array AND 'residents' array
     */
    if (role == 1) {
      promises.push(rezziRef.update({
        RA_list: admin.firestore.FieldValue.arrayRemove(email),
      }))
      promises.push(floorDocRef.update({
        ras: admin.firestore.FieldValue.arrayRemove(email),
      }))
    } else if (role == 2) {
      promises.push(rezziRef.update({
        resident_list: admin.firestore.FieldValue.arrayRemove(email),
      }))
    }

    promises.push(floorDocRef.update({
      residents: admin.firestore.FieldValue.arrayRemove(email),
    }))

    // Loop through each channel in their channel list and remove them from the members list
    let channels = []
    channels = data.channels

    // if floor channel; else hallwide channel
    for (let i = 0; i < channels.length; i++) {
      const channelID = channels[i]
      if (channelID.indexOf("floors") !== -1) {
        // TODO find way to include everything after this dash? Also in join-channel
        const firstDash = channelID.indexOf('-')
        const secondDash = channelID.indexOf('-', firstDash + 1)
        const channelName = channelID.substring(secondDash + 1)
        const floorChannelDocRef = floorDocRef.collection('channels').doc(channelName)
        const promise = floorChannelDocRef.get().then(floorChannelDoc => {
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
        const firstDash = channelID.indexOf('-')  // The "only" dash in a hallwide or RA channel ID
        const raOrHall = channelID.substring(0, firstDash)
        const channelName = channelID.substring(firstDash + 1)
        const raOrHallChannelDocRef = rezziRef.collection(raOrHall).doc(channelName)
        const promise = raOrHallChannelDocRef.get().then(raOrHallChannelDoc => {
          const memberMuteStatuses = raOrHallChannelDoc.data().memberMuteStatuses
          const updatedMuteStatuses = []
          for (let i = 0; i < memberMuteStatuses.length; i++) {
            if (memberMuteStatuses[i].email != email) {
              updatedMuteStatuses.push(memberMuteStatuses[i])
            }
          }
          return raOrHallChannelDocRef.update({
            members: admin.firestore.FieldValue.arrayRemove(email),
            memberMuteStatuses: updatedMuteStatuses
          })
        })
        promises.push(promise)
      }
    }

    // Delete the user document
    promises.push(deleteRef.delete())

    // Remove them from the list of users to be deleted in the HD user doc
    promises.push(hdDocRef.update({
      deletionRequests: admin.firestore.FieldValue.arrayRemove(email)
    }))

    // Send response when all promises are completed
    Promise.all(promises).then((resolved) => {
      response.status(http.ok).json({ resolved, msg: 'User has been deleted' })
    }).catch((reject) => {
      response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
    })
  }).catch((error) => {
    response.status(http.bad_request).json({ error: error, msg: 'Something went wrong. Please try again later.' })
  })
})

module.exports = router;
