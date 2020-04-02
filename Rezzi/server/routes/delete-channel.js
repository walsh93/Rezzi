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
  channelMembers = []
  const req = request.body
  console.log(req)
  const channel = req.channel;
  const level = req.channel_level;

  db.collection(keys.users).doc(request.__session.email).get().then((doc) => {
    const data = doc.data();
    console.log(data)

    if (isEmpty(data.rezzi) || isEmpty(data.floor)) {
      response.status(http.bad_request).send('Your Rezzi and/or floor is not set in our database. Please contact an administrator.')
    } else {

      /* RA-level channel */
      if (level == keys.ra) {
        //get members
        console.log(keys.residence_halls + data.rezzi + keys.ra + channel.channel);
        db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.ra).doc(channel.channel).get().then(doc => {
              channelMembers = doc.data().members;

              // remove channel from members' channel list
              channelMembers.forEach(member => {
                db.collection(keys.users).doc(member).update({
                  channels: admin.firestore.FieldValue.arrayRemove(channel.id)
                })
              })

              // remove channel from residence hall's channel list
              db.collection(keys.residence_halls).doc(data.rezzi)
                .collection(keys.ra).doc(channel.channel).delete().then((write_result) => {
                  response.status(http.ok).send('Your RA channel has been successfully deleted.')
                })
            }
          ).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          })

      /* Hallwide-level channel */
      } else if (level == keys.hallwide) {
        //get members
        console.log(keys.residence_halls + data.rezzi + keys.hallwide + channel.channel);
        db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.hallwide).doc(channel.channel).get().then(doc => {
              channelMembers = doc.data().members;

              // remove channel from members' channel list
              channelMembers.forEach(member => {
                db.collection(keys.users).doc(member).update({
                  channels: admin.firestore.FieldValue.arrayRemove(channel.id)
                })
              })

              // remove channel from residence hall's channel list
              db.collection(keys.residence_halls).doc(data.rezzi)
                .collection(keys.hallwide).doc(channel.channel).delete().then((write_result) => {
                  response.status(http.ok).send('Your hallwide channel has been successfully deleted.')
                })
            }
          ).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          })

      /* Floor-level channel */
      } else {
        const floor = String(channel.id).split('-')[1];
        const channelName = channel.channel;
        console.log('floor', floor)
        console.log('channelName', channelName)
        //get members
        console.log(keys.residence_halls + data.rezzi + keys.hallwide + channel.channel);
        db.collection(keys.residence_halls).doc(data.rezzi).collection(keys.floors)
          .doc(floor).collection('channels').doc(channelName).get().then(doc => {
              channelMembers = doc.data().members;

              // remove channel from members' channel list
              channelMembers.forEach(member => {
                db.collection(keys.users).doc(member).update({
                  channels: admin.firestore.FieldValue.arrayRemove(channel.id)
                })
              })

              // remove channel from residence hall's channel list
              db.collection(keys.residence_halls).doc(data.rezzi)
                .collection(keys.floors).doc(floor).collection('channels')
                .doc(channelName).delete().then((write_result) => {
                  response.status(http.ok).send('Your hallwide channel has been successfully deleted.')
                })
            }
          ).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          })
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
