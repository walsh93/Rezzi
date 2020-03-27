
const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const edit_profile = require('../constants').edit_profile

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {
  const req = request.body;
  const email = request.__session.email;

  // Get rezzis the user belongs to
  let user = '';
  let name = '';

  db.collection(keys.users).doc(email).get().then(doc => {
    console.log("userss: " + doc.data().email);
    if (doc.exists) {
      user = doc.data().email;
      name = doc.data().email;

    }
    console.log('user:' + user + " " + name);

  })


});



module.exports = router
