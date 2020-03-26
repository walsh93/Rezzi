const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInRA
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', function(request, response) {
  const req = request.body
  const raEmail = request.__session.email
  const channelDocRef = db.collection(req.channelPath).doc(req.channelName)
  const raDocRef = db.collection(keys.users).doc(raEmail)

  let promises = []

  if (req.approved) {
    // Update channel approval status and add RA as a member
    promises.push(channelDocRef.update({
      approvalStatus: true,
      members: admin.firestore.FieldValue.arrayUnion(raEmail)
    }))

    // Add channel to RA's list of channels
    promises.push(raDocRef.update({
      channels: admin.firestore.FieldValue.arrayUnion(req.channelID)
    }))
  } else {
    // Delete channel document from the database
    promises.push(channelDocRef.delete())
  }

  // Remove channel request from RA's list of channel requests
  promises.push(raDocRef.get().then((raDoc) => {
    const chanReqs = raDoc.data().channelRequests
    chanReqs.splice(req.index, 1)
    raDocRef.update({
      channelRequests: chanReqs
    })
  }))

  // Handler after all promises have completed
  Promise.all(promises).then((resolved) => {
    response.status(http.ok).json({ resolved, msg: 'Your response and been fulfilled.' })
  }).catch((reject) => {
    response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
  })
})

module.exports = router
