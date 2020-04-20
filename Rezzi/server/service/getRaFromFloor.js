// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const http = require('../constants').http_status

router.get('/', function(request, response) {
  db.collection('residence-halls').doc(request.query.rezzi).collection('floors').doc(request.query.floor).get().then((doc) => {
    const ras = doc.data().ras
    if (ras == null || ras == undefined || ras.length < 1) {
      response.status(http.bad_request).json({ msg: 'ras array not yet implemented when this Rezzi was created' })
    } else {
      response.status(http.ok).json({ ra: ras[0] })
    }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
