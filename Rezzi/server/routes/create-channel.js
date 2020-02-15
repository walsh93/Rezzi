const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInRA
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
}).post('/', function(request, response) {
  const req = request.body
  console.log(req)

  // TODO @Aaron Lynn
})

module.exports = router
