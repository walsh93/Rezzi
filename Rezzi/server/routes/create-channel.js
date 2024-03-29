const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAdmin
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const req = request.body

  db.collection(keys.users).doc(request.__session.email).get().then((doc) => {
    const data = doc.data()

    if (isEmpty(data.rezzi) || isEmpty(data.floor)) {
      response.status(http.bad_request).send('Your Rezzi and/or floor is not set in our database. Please contact an administrator.')
    } else {
      const memberMuteStatuses = []
      for (let i = 0; i < req.memberEmails.length; i++) {
        const muteStatus = {
          email: req.memberEmails[i],
          isMuted: false  // Set to false by default
        }
        memberMuteStatuses.push(muteStatus)
      }

      // Create channel object to save in the database
      const channel = {
        owner: req.owner,
        approvalStatus: true,
        title: req.title,
        level: req.level,
        description: req.description,
        members: req.memberEmails,
        memberMuteStatuses: memberMuteStatuses,
        calendar: [],  // Copied from Riley's implementation
        messages: [],
      }

      const errorMsg = 'There was an error creating your channel'

      if (req.level == keys.ra) {

        /* add channel to residence-halls channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.ra).doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your RA channel has been successfully created!')
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

        /*add Notification document for channel owner*/
        db.collection(keys.users + '/' + channel.owner + '/' + 'Notifications').doc(channel.level + "-" + channel.title).set({
          muted: false,
          notifications: [],
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

        /*add notification document for users */
        for(member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users + '/' + userAdd + '/' + 'Notifications').doc(channel.level + "-" + channel.title).set({
            muted: false,
            notifications: [],
          });
        }

      } else if (req.level == keys.hallwide) {

        /* add channel to residence-halls channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.hallwide).doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your hallwide channel has been successfully created!')
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

        /*add Notification document for channel owner*/
        db.collection(keys.users + '/' + channel.owner + '/' + 'Notifications').doc(channel.level + "-" + channel.title).set({
          muted: false,
          notifications: [],
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

        /*add notification document for users */
        for(member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users + '/' + userAdd + '/' + 'Notifications').doc(channel.level + "-" + channel.title).set({
            muted: false,
            notifications: [],
          });
        }

      } else {

        /* add channel to residence-hall channel collection */
        db.collection(keys.residence_halls).doc(data.rezzi)
            .collection(keys.floors).doc(data.floor)
            .collection('channels').doc(channel.title).set(channel).then((write_result) => {
          response.status(http.ok).send('Your floor interest channel has been successfully created!')
        }).catch((error) => {
          console.log("Error when adding channel to residence hall channel collection", error)
//          response.status(http.bad_request).send(errorMsg)
        })

        /* add channel to owner's channel list */
        db.collection(keys.users).doc(channel.owner).update({
          channels: admin.firestore.FieldValue.arrayUnion("floors-" + data.floor + "-" + channel.title)
        }).catch((error) => {
          console.log("Error when adding channel to owner's channel list", error)
//          response.status(http.bad_request).send(errorMsg)
        });

        /*add Notification document for channel owner*/
        db.collection(keys.users + '/' + channel.owner + '/' + 'Notifications').doc("floors-" + data.floor + "-" + channel.title).set({
          muted: false,
          notifications: [],
        });

        /* add channel to user(s)'s channel list */
        for (member in channel.members) {
          var userAdd = channel.members[member]
          db.collection(keys.users).doc(userAdd).update({
            channels: admin.firestore.FieldValue.arrayUnion("floors-" + data.floor + "-" + channel.title)
          }).catch((error) => {
            console.log("Error when adding channel user(s)'s channel list", error)
//            response.status(http.bad_request).send(errorMsg)
          });
        }

        /*add notification document for users */
        for(member in channel.members){
          var userAdd = channel.members[member]
          db.collection(keys.users + '/' + userAdd + '/' + 'Notifications').doc("floors-" + data.floor + "-" + channel.title).set({
            muted: false,
            notifications: [],
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
