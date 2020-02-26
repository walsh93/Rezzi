// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {

  db.collection(keys.users).doc(request.__session.email).get().then(doc => {
    if (doc.exists) {
      const userrezzi = doc.data().rezzi;
      db.collection('residence-halls').doc(userrezzi).collection('floors').get().then((snapshot) => {
        let floors = []
        snapshot.forEach((floorDoc) => {
          floors.push(floorDoc.id)
        })
        response.status(http.ok).json({ floors: floors })  // will be accessed as data_from_backend in prev code blocks
      }).catch((error) => {
        console.log('Error getting documents', error)
        response.status(http.conflict).json(null)
      })
    } else {
      console.log('Doc not found')
      response.status(http.bad_request).send('Error retrieving floors')
    }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })

})

module.exports = router
