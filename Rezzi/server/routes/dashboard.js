const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndUnverified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const firebase = require('../database')

router.get('/', checkCookie, function (request, response) {
  response.status(200).json({
    notification: 'Dashboard',
  });
  //response.sendFile(indexFile)
}).post('/api/edit-profile', (request, response, next) => {
  const rb = request.body
  const email = request.__session.email;
  console.log("EMAIL: " + email)
  console.log("this: " + rb);
  firebase.editUser(email);
  response.status(201).json({
    notification: 'User may be edited?'
  })
  //add user here
})

module.exports = router
