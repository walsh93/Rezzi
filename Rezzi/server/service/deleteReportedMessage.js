const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const keys = require('../constants').db_keys

router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi;
  const HD = String(request.query.HD);
  const messageId = String(request.query.messageId);

  if (messageId == undefined || messageId == null || !messageId.includes('-')) {
    console.log('Invalid message type');
    response.status.http.conflict.json(null);
    return;
  }

  db.collection(keys.users).doc(HD).update({
    reportedMessages: admin.firestore.FieldValue.arrayRemove(messageId)
  }).then(() => {
    response.status(http.ok).json(null);
  }).catch((error) => {
    console.log('Error getting message', error)
    response.status(http.conflict).json(null)
  })

})

module.exports = router;
