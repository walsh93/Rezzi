const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInRA
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const req = request.body
  console.log(req)

  db.collection(keys.users).doc(request.__session.email).get().then((doc) => {
    const data = doc.data()

    // Create channel object to save in the database
    const channel = {
      owner: req.owner,
      approvalStatus: true,
      title: req.title,
      level: req.level,
      description: req.description,
      members: req.memberEmails,  // messages and calendars can be added as they're created
    }

    const errorMsg = 'There was an error creating your channel'

    /**
     * TODO @aaronlynn
     * Not currently sure where the user's floor is being stored or what the key(s) for the user's
     * floor and rezzi are. Need those keys to correctly query the database
     * Also, once we know where to reroute to (what the link is), use the currently commented-out
     * `response.status().redirect()` statement instead
     */
    if (req.level == keys.ra) {
      db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.ra).doc(channel.title).set(channel).then((write_result) => {
        response.status(http.ok).send('Your RA channel has been successfully created!')
//        response.status(http.ok).redirect('wherever the view-channel link is')
      }).catch((error) => {
        console.log(error)
        response.status(http.bad_request).send(errorMsg)
      })
    } else if (req.level == keys.hallwide) {
      db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.hallwide).doc(channel.title).set(channel).then((write_result) => {
        response.status(http.ok).send('Your hallwide channel has been successfully created!')
//        response.status(http.ok).redirect('wherever the view-channel link is')
      }).catch((error) => {
        console.log(error)
        response.status(http.bad_request).send(errorMsg)
      })
    } else {
      db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.floors).doc(data.floor)
          .collection('channels').doc(channel.title).set(channel).then((write_result) => {
        response.status(http.ok).send('Your floor interest channel has been successfully created!')
//        response.status(http.ok).redirect('wherever the view-channel link is')
      }).catch((error) => {
        console.log(error)
        response.status(http.bad_request).send(errorMsg)
      })
    }
  })
})

module.exports = router
