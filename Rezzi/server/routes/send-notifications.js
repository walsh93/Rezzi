const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', function(request, response) {
  const rb = request.body;
  const message = rb.message;
  //channel is whatever the notification document is called. For channels, it is in the format of floors-1N-General
  const channel = rb.channel;
  const recipients = rb.recipients;
  const rezzi = request.__session.rezzi;
  let promises = [];

  //get reference to channel from channel variable

  //for each user, if muted == false, add message to array at currentEmail > Notifications > channel

  
  for(var i = 0; i < recipients.length; i++){
      currentEmail = recipients[i];
      const channelNotificaitonDocRef = db.collection(keys.users + '/' + currentEmail + '/' + 'Notificaitons').doc(channel)
      promises.push(
      channelNotificaitonDocRef.get().then((doc => {
        const data = doc.data()
        if(data.muted == false){
          channelNotificaitonDocRef.update({
            notifications: FieldValue.arrayUnion(message),
          });
        }
      }))
      )
  }

  // Handler after all promises have completed
  Promise.all(promises).then((resolved) => {
    response.status(http.ok).json({ resolved, msg: 'Your notifications have been sent' })
  }).catch((reject) => {
    response.status(http.error).json({ reject: reject, msg: 'Something went wrong in sending notifications.' })
  }) 
})


module.exports = router;