const express = require('express')
const router = express.Router()

router.get('/', function(request, response) {
  response.json('sign-out requested')  // sign-out-button.component.ts expects a response object => can't just say response.send()
})

module.exports = router