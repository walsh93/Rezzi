const express = require('express')
const router = express.Router()

const checkCookie = require('../permissions').userNeedsToBeLoggedIn
const indexFile = require('../constants').indexFile

router.get('/', checkCookie, function(request, response) {
  const messages = [
    { id: '123456',
    content: 'First message'},
    { id: '123457',
    content: 'Second message'}
  ];
  response.status(200).json({
    notification: 'Posts fetched successfully!',
    messages: messages
  });
  //response.sendFile(indexFile)
})

module.exports = router
