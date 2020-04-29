const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const keys = require('../constants').db_keys

router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi;
  const messageId = String(request.query.messageId);

  if (messageId == undefined || messageId == null || !messageId.includes('-')) {
    console.log('Invalid message type');
    response.status.http.conflict.json(null);
    return;
  }

  const level = messageId.split('-')[0];

  if (level === 'floors') {
    const floor = messageId.split('-')[1];
    const channelName = messageId.split('-')[2];
    db.collection(keys.residence_halls).doc(rezzi).collection(keys.floors).doc(floor)
      .collection('channels').doc(channelName)
      .get().then(message => {

        for (let msg of message.data().messages) {
          if (msg.id === messageId) {
            response.status(http.ok).json({ message: msg })
            return;
          }
        }

        response.status(http.conflict).json(null);  // if no message found

    }).catch((error) => {
      console.log('Error getting message', error)
      response.status(http.conflict).json(null)
    })

  } else {
    const channelName = messageId.split('-')[1];

    db.collection(keys.residence_halls).doc(rezzi).collection(level).doc(channelName)
      .get().then(message => {

      for (let msg of message.data().messages) {
        if (msg.id === messageId) {
          response.status(http.ok).json({ message: msg })
          return;
        }
      }

      response.status(http.conflict).json(null);  // if no message found

    }).catch((error) => {
      console.log('Error getting message', error)
      response.status.http.conflict.json(null)
    })
  }
});

module.exports = router;
