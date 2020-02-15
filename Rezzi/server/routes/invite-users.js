const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedOut
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const invite_users = require('../constants').invite_users

//TODO: user needs to be logged in

router.get('/', checkCookie, function(request, response) {
    response.sendFile(indexFile)
  })

  module.exports = router