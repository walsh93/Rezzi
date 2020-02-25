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

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/api/sign-up',(request,response,next) => {
  const rb = request.body
  //console.log(rb);
  // firebase.addUser(rb);
  var working  = firebase.addUser(rb); // conley-edit-here
  console.log(working) // conley-edit-here
  request.__session.verified = true
  response.status(201).json({
    notification: 'User may be signed up?'
  })
  //add user here
})

module.exports = router
