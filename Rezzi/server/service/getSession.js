const express = require('express')
const router = express.Router()

router.get('/', function(request, response) {
  response.json(request.__session)
})

module.exports = router
