const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys
const checkCookie = require('../permissions').userNeedsToBeLoggedInAdmin

router.post('/', checkCookie, function (request, response) {
  const req = request.body  // .channelID, .email, .isMuted
  const channelID = req.channelID
  const rezzi = request.__session.rezzi
  let channelDocRef = null

  // Disect request.body.channelID to get correct document reference
  if (channelID.indexOf("floors") !== -1) {
    const firstDash = channelID.indexOf('-')
    const secondDash = channelID.indexOf('-', firstDash + 1)
    const floorName = channelID.substring(firstDash + 1, secondDash)
    const channelName = channelID.substring(secondDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/floors/${floorName}/channels`
    channelDocRef = db.collection(prefix).doc(channelName)
  } else {
    const firstDash = channelID.indexOf('-')  // The "only" dash in a hallwide channel ID
    const raOrHall = channelID.substring(0, firstDash)
    const channelName = channelID.substring(firstDash + 1)
    const prefix = `${keys.rezzis}/${rezzi}/${raOrHall}`
    channelDocRef = db.collection(prefix).doc(channelName)
  }

  channelDocRef.get().then(channelDoc => {
    const memberMuteStatuses = channelDoc.data().memberMuteStatuses
    for (let i = 0; i < memberMuteStatuses.length; i++) {
      if (memberMuteStatuses[i].email == req.email) {
        memberMuteStatuses[i].isMuted = req.isMuted
        break
      }
    }
    return channelDocRef.update({
      memberMuteStatuses: memberMuteStatuses
    }).then((result) => {
      response.status(http.edited).json({ status: http.edited });
    }).catch((err) => {
      response.status(http.error).json({ status: http.error, error: err });
    })
  })
});

module.exports = router;
