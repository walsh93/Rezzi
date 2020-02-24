const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const c = require('../constants');


router.get(':/userId', function(request,response) {
  db.collection(db_keys.users).doc(request.params.userId).get().then((doc) => {
    if (!doc.exists) {
      response.redirect('/home');
    } else {
      response.json(doc.data());
    }
  });
})
module.exports = router;
