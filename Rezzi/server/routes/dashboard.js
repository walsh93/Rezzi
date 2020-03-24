const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const firebase = require('../database')

router.get('/', checkCookie, function (request, response) {
  // response.status(200).json({
  //   notification: 'Dashboard',
  // });
  response.sendFile(indexFile)
}).post('/api/edit-profile', (request, response, next) => {
  const rb = request.body
  const email = request.__session.email;
  firebase.editUser(rb, email);
  response.status(201).json({
    notification: 'User may be edited?'
  })
  //add user here
}).post('/api/edit-profile/deletion', (request, response, next) => {
  const rb = request.body
  const email = request.__session.email;
  firebase.requestAccountDeletion(rb, email);
  response.status(201).json({
    notification: 'User may have requested to delete account'
  })
  // }).post('/api/edit-profile/update-hd', (request, response, next) => {
  //   const rb = request.body
  //   const email = request.__session.email;
  //   firebase.updateHD(rb,email);
  //   response.status(201).json({
  //     notification: 'User may have requested to delete account'
  //   })
})
  .post('/api/edit-profile/find-user', (request, response, next) => {
    const rb = request.body
    let email = '';
    const rezzi = request.__session.rezzi
    db.collection(keys.rezzis).doc(rezzi).get().then(doc => {
      const data = doc.data()
      email = data.HD;
    }).catch((error) => {
      console.log('Error getting documents', error)
      response.status(http.conflict).json(null)
    })
    console.log(email);

    console.log("wefewfewfewfew");
    firebase.findUser(rb, email);
    response.status(201).json({
      notification: 'User may have requested to delete account'
    })
  })
module.exports = router
