const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', function(request, response) {
  const req = request.body
  const hdEmail = request.__session.email
  const hdDocRef = db.collection(keys.users).doc(raEmail)
})


module.exports = router;
