const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedIn
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const url = require('../constants').url

router.post('/', checkCookie, function(request, response) {
  const req = request.body;
  const email = request.__session.email;
  // db.collection(keys.users).where
})

module.exports = router