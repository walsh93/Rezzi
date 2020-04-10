// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const channelInfo = request.body.channel
  if (channelInfo.owner == null || channelInfo.owner == undefined) {
    response.status(http.bad_request).json({ msg: 'Channel owner (RA) not defined' })
  } else {
    const rezzi = request.query.rezzi

    // Add channel entry to the database
    const channel = {
      owner: channelInfo.owner,
      approvalStatus: false,
      title: channelInfo.title,
      level: channelInfo.level,
      description: channelInfo.description,
      members: [],
      memberMuteStatuses: [],
      calendar: [],  // Copied from Riley's implementation
      messages: [],
    }

    if (channelInfo.level == keys.hallwide) {
      db.collection(keys.residence_halls).doc(rezzi).collection(keys.hallwide).doc(channel.title).set(channel)
    } else if (channelInfo.level == 'floor') {
      db.collection(keys.residence_halls).doc(rezzi).collection(keys.floors).doc(request.query.floor)
        .collection('channels').doc(channel.title).set(channel)
    }

    // Alert after RA has gotten the request; error check for channel creation in request approval/denial
    const raDocRef = db.collection('users').doc(channelInfo.owner)
    raDocRef.get().then((raDoc) => {
      let channelRequests = raDoc.data().channelRequests
      if (channelRequests == null || channelRequests == undefined) {
        channelRequests = []
      }
      channelRequests.push(request.body.channelID)
      raDocRef.update({
        channelRequests: channelRequests
      }).then(() => {
        console.log('/request-channel Okay status being sent')
        response.status(http.ok).json({ msg: 'Your request has been sent to your RA' })
      })
    }).catch((error) => {
      console.log('Error getting documents', error)
      console.log('/request-channel NO-kay status being sent')
      response.status(http.conflict).json({ msg: 'Your request could not be sent to your RA. Try again later.' })
    })
  }
})

module.exports = router
