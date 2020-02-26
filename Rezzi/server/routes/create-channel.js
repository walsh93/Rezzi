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

    if (isEmpty(data.rezzi) || isEmpty(data.floor)) {
      response.status(http.bad_request).send('Your Rezzi and/or floor is not set in our database. Please contact an administrator.')
    } else {
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

      // TODO make separate functions for all of the different db updates?

      if (req.level == keys.ra) {

        /* add channel to residence-halls channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.ra).doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your RA channel has been successfully created!')
//          response.status(http.ok).redirect('wherever the view-channel link is')
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        })

        /* add channel to owner's channel list */
        db.collection(keys.users).doc(channel.owner).update({
          channels: admin.firestore.FieldValue.arrayUnion(channel.level + "-" + channel.title)
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        });

        /* add channel to user(s)'s channel list */
        for (member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users).doc(userAdd).update({
            channels: admin.firestore.FieldValue.arrayUnion(channel.level + "-" + channel.title)
          }).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          });
        }

      } else if (req.level == keys.hallwide) {

        /* add channel to residence-halls channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.hallwide).doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your hallwide channel has been successfully created!')
//          response.status(http.ok).redirect('wherever the view-channel link is')
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        })

        /* add channel to owner's channel list */
        db.collection(keys.users).doc(channel.owner).update({
          channels: admin.firestore.FieldValue.arrayUnion(channel.level + "-" + channel.title)
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        });

        /* add channel to user(s)'s channel list */
        for (member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users).doc(userAdd).update({
            channels: admin.firestore.FieldValue.arrayUnion(channel.level + "-" + channel.title)
          }).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          });
        }

      } else {

        /* add channel to residence-hall channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.floors).doc(data.floor)
            .collection('channels').doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your floor interest channel has been successfully created!')
//          response.status(http.ok).redirect('wherever the view-channel link is')
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        })

        /* add channel to owner's channel list */
        db.collection(keys.users).doc(channel.owner).update({
          channels: admin.firestore.FieldValue.arrayUnion("floors-" + data.floor + "-" + channel.title)
        }).catch((error) => {
          console.log(error)
          response.status(http.bad_request).send(errorMsg)
        });

        /* add channel to user(s)'s channel list */
        for (member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users).doc(userAdd).update({
            channels: admin.firestore.FieldValue.arrayUnion("floors-" + data.floor + "-" + channel.title)
          }).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          });
        }

      }
    }
  })
})

/**
 * Checks if a string is empty
 * @param {string} str - string to check
 */
function isEmpty(str) {
  if (str == null || str == undefined || str.length == 0) {
    return true
  }
  return false
}

module.exports = router
