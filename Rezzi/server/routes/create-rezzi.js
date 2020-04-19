const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  // console.log(req);
  db.collection(keys.users).doc(email).update({
    rezzi: req.name
  });

  request.__session.rezzi = req.name

  const rezziAttributes = {
    RA_list: [],
    resident_list: [],
    HD: email,
  };

  db.collection(keys.rezzis).doc(req.name).set(rezziAttributes).then(resolve => {
    // Add floors
    var promises = [];
    var prefix = keys.rezzis + '/' + req.name + '/floors';
    req.floors.forEach(floor => {
      promises.push(db.collection(prefix).doc(floor.name).set({
        residents: [],
        ras: []
      }));
    });
    Promise.all(promises).then(resolve => {
      promises = [];
      req.floors.forEach(floor => {
        floor.channels.forEach(channel => {
          promises.push(db.collection(prefix + '/' + floor.name + '/channels').doc(channel.name).set({
            owner: email,  // the HD should be the one currently logged in?
            approvalStatus: true,
            title: `${channel.name}`,
            level: 'floor',
            description: '',
            calendar: [],
            members: [],
            memberMuteStatuses: [],
            messages: [],
            // default: channel.default
          }))
        })
      })

      Promise.all(promises).then(resolve => {
        // Add hallwide and RA channels
        promises = [];
        req.ra_channels.forEach(channel => {
          promises.push(db.collection(keys.rezzis + '/' + req.name + '/RA').doc(channel.name).set({
            owner: email,  // the HD should be the one currently logged in?
            approvalStatus: true,
            title: `${channel.name}`,
            level: 'RA',
            description: '',
            calendar: [],
            members: [],
            memberMuteStatuses: [],
            messages: [],
            // default: channel.default
          }))
        })

        req.hallwide_channels.forEach(channel => {
          promises.push(db.collection(keys.rezzis + '/' + req.name + '/hallwide').doc(channel.name).set({
            owner: email,  // the HD should be the one currently logged in?
            approvalStatus: true,
            title: `${channel.name}`,
            level: 'hallwide',
            description: '',
            calendar: [],
            members: [],
            memberMuteStatuses: [],
            messages: [],
            // default: channel.default
          }))
        })

        Promise.all(promises).then(resolve => {
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
