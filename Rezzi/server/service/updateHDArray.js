const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys


const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi
  let hd = '';
  db.collection(keys.rezzis).doc(rezzi).get().then(doc => {
    const data = doc.data()
    hd = data.HD;


    let users = [];

    db.collection('users').doc(hd).get().then(doc => {
      const data = doc.data()


      response.status(http.ok).json({ hd: hd })  // will be accessed as data_from_backend in prev code blocks

    }).catch((error) => {
      console.log('Error getting documents', error)
      response.status(http.conflict).json(null)
    })
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
});



module.exports = router;
