const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  i = 0;
  privateMessagesData = [];

  db.collection(keys.users).doc(email).collection(keys.private_messages).get()
  .then(snapshot => {
    snapshot.forEach(doc =>{
      temp = {};
      temp.recipient = doc.id;
      temp.messages = doc.data();
      privateMessagesData[i] = temp;
      i++;
    })
    response.status(200).json(privateMessagesData);
  })
})

 module.exports = router;
