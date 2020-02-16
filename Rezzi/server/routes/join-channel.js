const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedIn
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const url = require('../constains').url

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post(url.join_channel, function(request, response) {
  const req = request.body
  console.log(req)
  // db.collection(keys.channels).where
})

module.exports = router