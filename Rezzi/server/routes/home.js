const express = require('express')
const router = express.Router()

const checkCookie = require('../permissions').userNeedsToBeLoggedIn
const indexFile = require('../constants').indexFile

router.get('/', checkCookie, function(request, response) {
  response.sendFile(indexFile)
})

module.exports = router
