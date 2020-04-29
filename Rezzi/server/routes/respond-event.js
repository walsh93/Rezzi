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
  const email = request.__session.email;
  const rezzi = request.__session.rezzi;
  // console.log(request.__session);
  
  console.log("Responding to event...");
  console.log(req);
  const dbchannel = createChannelPath(rezzi, req.event.id.substring(0, req.event.id.lastIndexOf('-')));
  if (dbchannel != null) {
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let index = req.event.id.split('-').slice(-1)[0];
      let events = doc.data().calendar;
      let event = events[index];
      if (event.canceled !== true) {
        // check if the user was previously in the other categories
        if (!event.attending[req.response].some(responder => responder.email === email)) {  // Do nothing if it's already correct
          let responses = ['going', 'interested', 'not going'];
          responses.filter(response => response !== req.response).forEach(response => {  // Must remove from the others if applicable
            event.attending[response] = event.attending[response].filter(responder => responder.email !== email);
          });

          event.attending[req.response].push(req.user);

          events[index] = event;

          db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
            calendar: events,
          }).then(resp => {
            // Must also update the user calendar
            db.collection(keys.users).doc(email).get().then((doc) => {
              let events = doc.data().calendar;
              if (req.response === 'going') {
                if (!events.some(event => event === req.event.id)) {
                  events.push(req.event.id);
                }
              }
              else {
                events = events.filter(event => event !== req.event.id);
              }
              db.collection(keys.users).doc(email).update({
                calendar: events
              }).then(res => {
                response.status(200).json({success: 'Successfully responded to event!'});
              });
            });
          });
        }
        else {
          // Must also update the user calendar
          db.collection(keys.users).doc(email).get().then((doc) => {
            let events = doc.data().calendar;
            if (req.response === 'going') {
              if (!events.some(event => event === req.event.id)) {
                events.push(req.event.id);
              }
            }
            else {
              events = events.filter(event => event !== req.event.id);
            }
            db.collection(keys.users).doc(email).update({
              calendar: events
            }).then(res => {
              response.status(200).json({success: 'Successfully responded to event!'});
            });
          });
        }
      }
      else {
        response.status(500).json({error: 'Event has been canceled!'});
      }
    });
  }
})

module.exports = router
