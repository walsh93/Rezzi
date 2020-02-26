const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedOut
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const c = require('../constants')
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {
    response.sendFile(indexFile)
  })
  
  module.exports = router;