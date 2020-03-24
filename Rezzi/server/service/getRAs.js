//Megan is working on this don't worry it's not done yet
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
  let RAs = [];
  db.collection(keys.rezzis).doc(request.__session.rezzi).get().then((snapshot) => {
    
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })

})

module.exports = router