const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const FieldValue = require('firebase-admin').firestore.FieldValue;

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const rb = request.body;
  const message = rb.message;
  //channel is whatever the notification document is called. For channels, it is in the format of floors-1N-General
  const channel = rb.channel;
  console.log(channel)
  const recipients = rb.recipients;
  // array of emails
  const rezzi = request.__session.rezzi;
  let promises = [];



  //for each user, if muted == false, add message to array at currentEmail > Notifications > channel

  rb.recipients.forEach(element => {
    promises.push(db.collection(keys.users).doc(element).collection("Notifications").doc(channel).get().then((doc) => {
      console.log("before doc.data")
      const data = doc.data()
      console.log("data: ", data)
      console.log(data.muted)
      if(data.muted == false){
        db.collection(keys.users).doc(element).collection("Notifications").doc(channel).update({'notifications': FieldValue.arrayUnion(message)})
      }
    })
    )
  });
  //fixing error

  // Handler after all promises have completed
  Promise.all(promises).then((resolved) => {
    console.log('all promises pushed')
    response.status(http.ok).json({ resolved, msg: 'Your notifications have been sent' })
  }).catch((reject) => {
   console.log(reject);
    response.status(http.error).json({ reject: reject, msg: 'Something went wrong in sending notifications.' })
  })
})


module.exports = router;
