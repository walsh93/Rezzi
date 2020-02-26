const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const url = require('../constants').url

router.post('/', checkCookie, function(request, response) {
  const req = request.body;
  console.log(req);
  db.collection(keys.rezzis).doc(req.name).set({}).then(response => {
    // Add floors
    var promises = [];
    var prefix = keys.rezzis + '/' + req.name + '/floors';
    req.floors.forEach(floor => {
      promises.push(db.collection(prefix).doc(floor.name).set({
        residents: []
      }));
    });
    Promise.all(promises).then(response => {
      promises = [];
      req.floors.forEach(floor => {
        floor.channels.forEach(channel => {
          promises.push(db.collection(prefix + '/' + floor.name + '/channels').doc(channel.name).set({
            calendar: [],
            members: [],
            messages: [],
            // default: channel.default
          }))
        })
      })

      Promise.all(promises).then(response => {
        // Add hallwide and RA channels
        promises = [];
        req.ra_channels.forEach(channel => {
          promises.push(db.collection(keys.rezzis + '/' + req.name + '/RA').doc(channel.name).set({
            calendar: [],
            members: [],
            messages: [],
            // default: channel.default
          }))
        })

        req.hallwide_channels.forEach(channel => {
          promises.push(db.collection(keys.rezzis + '/' + req.name + '/hallwide').doc(channel.name).set({
            calendar: [],
            members: [],
            messages: [],
            // default: channel.default
          }))
        })

        Promise.all(promises).then(reponse => {
          response.status(http.ok)
        }).catch(reject => {
          response.status(http.error).json({error: reject})
          console.log(reject)
        })
      }).catch(reject => {
        response.status(http.error).json({error: reject})
        console.log(reject)
      })
    })
  });
})

module.exports = router