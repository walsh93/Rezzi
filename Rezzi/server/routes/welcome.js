const express = require('express')
const router = express.Router()
const indexFile = require('../constants').indexFile

router.get('/', function(request, response) {
  response.sendFile(indexFile)
})

module.exports = router
