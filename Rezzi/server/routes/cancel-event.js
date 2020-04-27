const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const createChannelPath = require('../database').createChannelPath

router.post('/', function(request, response) {
  const req = request.body
  const rezzi = request.__session.rezzi;
  // console.log(request.__session);
  
  console.log("Canceling event...");
  console.log(req);
  const dbchannel = createChannelPath(rezzi, req.event.id.substring(0, req.event.id.lastIndexOf('-')));
  if (dbchannel != null) {
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let index = req.event.id.split('-').slice(-1)[0];
      let events = doc.data().calendar;
      let event = events[index];
      events[index] = {
        id: req.event.id,
        canceled: true
      };

      db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
        calendar: events
      });

      // must delete it from every user calendar attending
      let promises = [];
      event.attending.going.forEach(user => {
        promises.push(new Promise((resolve, reject) => {
          db.collection(keys.users).doc(user.email).get().then((doc2) => {
            let user_events = doc2.data().calendar.filter(ev => ev !== event.id);
            db.collection(keys.users).doc(user.email).update({
              calendar: user_events
            }).then(r => {resolve('success')}).catch(e => reject(e));
          }).catch(e => reject(e));
        }))
      });

      Promise.all(promises).then(responses => {
        response.status(200).json({success: 'success'});
      }).catch(reject => {
        response.status(500).json({error: reject});
      });
    });
  }
})

module.exports = router
