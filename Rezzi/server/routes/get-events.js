const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const createChannelPath = require('../database').createChannelPath

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  const eventChannel = request.query.channel;

  // Get events the user is going to
  var going_to = [];
  var events = {
    channels: [],
    attending: [],
    available: [], 
  };
  db.collection(keys.users).doc(email).get().then(doc => {
    const rezzi = doc.data().rezzi;

    going_to = doc.data().calendar;

    // get events the user is going to and add them to events
    function getEventData(event) {
      return new Promise((resolve, reject) => {
        channel_id = event.substring(0, event.lastIndexOf('-'));
        event_index = event.split('-').slice(-1)[0];

        dbchannel = createChannelPath(rezzi, channel_id);
        db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then(doc2 => {
          var calendar = doc2.data().calendar;
          resolve(calendar[event_index]);
        }).catch(rejection => {
          console.log("ERROR:", rejection);
          resolve(null);
        });
      })
    }

    var promises = [];
    going_to.forEach(ev => {
      promises.push(getEventData(ev));
    });

    Promise.all(promises).then(responses => {
      responses.forEach(response => {
        if (response !== null)
          events.attending.push(response);
      });

      // get the different channels that will be displayed on the calendar
      var channels = going_to.map(id => {
        return id.substring(0, id.lastIndexOf('-'));
      })
      channels.push(eventChannel);
      events.channels = channels.filter((channel, i, ar) => ar.indexOf(channel) === i); // only want unique values

      // get the events in the channel that the user is viewing that the user could go to, but currently isn't
      dbchannel = createChannelPath(rezzi, eventChannel);

      db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then(doc2 => {
        var available = doc2.data().calendar;
        for (i = 0; i < available.length; i++) {
          if (!going_to.includes(available[i].id)) {  // check if the user is going to the event already
            events.available.push(available[i]);
          }
        }

        response.status(200).json(events);
      });
    });
  });
})

 module.exports = router;
