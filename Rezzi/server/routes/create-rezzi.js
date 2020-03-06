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

  // Need to redefine the session
  // savedEmail = request.__session.email
  // savedVerified = request.__session.verified
  // savedAccountType = request.__session.accountType

  // request.__session.reset()
  // request.__session = {
  //   email: savedEmail,
  //   verified: savedVerified,
  //   accountType: savedAccountType,
  //   rezzi: req.name,
  // }

  db.collection(keys.rezzis).doc(req.name).set({}).then(resolve => {
    // Add floors
    var promises = [];
    var prefix = keys.rezzis + '/' + req.name + '/floors';
    req.floors.forEach(floor => {
      promises.push(db.collection(prefix).doc(floor.name).set({
        residents: []
      }));
    });
    Promise.all(promises).then(resolve => {
      promises = [];
      req.floors.forEach(floor => {
        floor.channels.forEach(channel => {
          promises.push(db.collection(prefix + '/' + floor.name + '/channels').doc(channel.name).set({
            owner: email,  // the HD should be the one currently logged in?
            approvalStatus: true,
            title: `${req.name}: ${floor.name} ${channel.name}`,
            level: 'floor',
            description: '',
            calendar: [],
            members: [],
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
            title: `${req.name}: RA ${channel.name}`,
            level: 'RA',
            description: '',
            calendar: [],
            members: [],
            messages: [],
            // default: channel.default
          }))
        })

        req.hallwide_channels.forEach(channel => {
          promises.push(db.collection(keys.rezzis + '/' + req.name + '/hallwide').doc(channel.name).set({
            owner: email,  // the HD should be the one currently logged in?
            approvalStatus: true,
            title: `${req.name}: Hallwide ${channel.name}`,
            level: 'hallwide',
            description: '',
            calendar: [],
            members: [],
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
