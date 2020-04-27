const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const keys = require('../constants').db_keys

router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi;
  const messageId = request.messageId;

  const level = messageId.split('-')[0];

  if (level === 'floors') {
    const floor = messageId.split('-')[1];
    const channelName = messageId.split('-')[2];
    db.collection(keys.residence_halls).doc(rezzi).collection(keys.floors)
      .doc(floor).collection('channels').doc(channelName).collection(keys.messages)
      .where('id', '===', messageId).get().then(message => {
        response.status(http.ok).json({ message: message })
    }).catch((error) => {
      console.log('Error getting message', error)
      response.status.http.conflict.json(null)
    })
  } else {
    const channelName = messageId.split('-')[1];
    db.collection(keys.residence_halls).doc(rezzi).collection(level)
      .collection('channels').doc(channelName).collection(keys.messages)
      .where('id', '===', messageId).get().then(message => {
        response.status(http.ok).json({ message: message })
    }).catch((error) => {
      console.log('Error getting message', error)
      response.status.http.conflict.json(null)
    })
  }
});

module.exports = router;
