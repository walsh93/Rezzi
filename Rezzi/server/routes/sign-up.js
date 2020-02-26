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
  firebase.addUser(rb).then(function(result){
    if(result==501){
        response.status(201).json({
        notification: "Error creating account! Try again."
      })
    }
    else{
      request.__session.verified = true
      response.status(201).json({
        notification: "You have successfully signed up!"
      })
    }
  }); // conley-edit-here
})

module.exports = router
