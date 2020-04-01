const express = require('express')
const router = express.Router()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const indexFile = require('../constants').indexFile
const firebase = require('../database')

router.get('/', checkCookie, function(request, response) {
  const messages = [
    { id: '123456',
    content: 'First message'},
    { id: '123457',
    content: 'Second message'}
  ];
  // response.status(200).json({
  //   notification: 'Posts fetched successfully!',
  //   messages: messages
  // });
  response.status(200).sendFile(indexFile)
}).post('/api/update-hd-rpt', (request, response, next) => {
  const rb = request.body
  let email = request.query.hd;
  let msg = request.query.msg;

  // for (const key in request.query) {
  //   console.log(key, request.query[key])
  // }

  firebase.updateHDArrayRPT(rb, email,msg);
  response.status(201).json({
    notification: 'User reported msg to hd'
  })
})


module.exports = router
