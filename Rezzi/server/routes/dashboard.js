const express = require('express')
const router = express.Router()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile

router.get('/', checkCookie, function(request, response) {
  response.status(200).json({
    notification: 'Posts fetched successfully!',
  });
  //response.sendFile(indexFile)
})

module.exports = router
