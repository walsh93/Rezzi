const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const c = require('../constants')
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {
    response.sendFile(indexFile)
  }).post('/', function(request, response) {
    const email = request.__session.email
    const password = request.body.password
    db.collection('users').doc(email).get().then(doc => {
        if(!doc.exists){
            console.log("hi so the doc doesnt exist")
            response.send(c.EMAIL_NOT_REGISTERED)
        } else {
            db.collection('users').doc(email).update({
                password: password,
                tempPword: false,
            })

            response.status(http.ok).send(url.home);
        }
    }).catch(err => {
        response.location('/pword-reset-change').render('pwordResetChange', { msg: 'There was an error' })
      });


  })

  
  module.exports = router;