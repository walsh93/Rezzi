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
    // TODO - add messages and calendars? Or dynamically add once they actually exist?
    const channel = {
      owner: req.owner,
      approvalStatus: true,
      title: req.title,
      level: req.level,
      description: req.description,
      members: req.memberEmails,
    }

    const errorMsg = 'There was an error creating your channel'

    // TODO - check that the keys are consistent with the database!!!!!!!!
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

  // TODO @Aaron Lynn
})

module.exports = router
