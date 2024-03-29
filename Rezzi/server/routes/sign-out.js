const express = require('express')
const router = express.Router()

const http = require('../constants').http_status

router.get('/', function(request, response) {
  request.__session.reset()
  response.sendStatus(http.ok)
})

module.exports = router
