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


      if (level == keys.ra) {
        //get members
        console.log(keys.residence_halls + data.rezzi + keys.ra + channel.channel);
        db.collection(keys.residence_halls).doc(data.rezzi)
          .collection(keys.ra).doc(channel.channel).get().then(doc => {
              console.log('Here you go, your majesty', doc.data());
              channelMembers = doc.data().members;
              console.log('channel members:', doc.data().members, channelMembers)
            }
          ).then(channelMembers => {
            // remove channel from requester's channel list
            for (member in channelMembers) {
              console.log('member', member)
              console.log('keys.users', keys.users)
              console.log('channel.id', channel.id)
              console.log('channel.channel', channel.channel)
              db.collection(keys.users).doc(member).update({
                channels: admin.firestore.FieldValue.arrayRemove(channel.id)
              });
            }}
          ).then(channelMembers => {
            db.collection(keys.residence_halls).doc(data.rezzi)
              .collection(keys.ra).doc(channel.channel).delete().then((write_result) => {
                response.status(http.ok).send('Your RA channel has been successfully deleted.')
              })
          }).catch((error) => {
            console.log(error)
            response.status(http.bad_request).send(errorMsg)
          })
        // remove channel from residence-halls channel collection
        // console.log('keys.residence_halls', keys.residence_halls)
        // console.log('data.rezzi', data.rezzi)
        // console.log('keys.ra', keys.ra)
        // console.log('channel.channel', channel.channel)



      } else if (level == keys.hallwide) {
        // remove channel from residence-halls channel collection
        // remove channel from user's channel list
        // remove channel from owner's channel list
      } else {
        const floor = channel.split('-')[1];
        const channelName = channel.split('-')[2];
        // remove channel from residence-halls channel collection
        // remove channel from user's channel list
        // remove channel from owner's channel list
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
