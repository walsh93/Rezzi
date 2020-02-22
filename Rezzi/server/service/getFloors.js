// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const c = require('../../constants');

router.get('/', checkCookie, function(request, response) {
    db.collection('residence-halls').get().then((snapshot) => {
      /**
       * You may not want to send the entire Firestore document object, you may just
       * want to extract a few fields from each user document. That is what I'm
       * doing in this example, but you can keep as many or as few fields as you would
       * like. If you want to send everything in the document, then you can just send
       * the entire variable `snapshot` back to the frontend. 
       */

       //need to get list from residence-hall.{rezzi}.floors
  
      let floors = []
      snapshot.forEach((floor) => {
        const data = user.data()
        const user = {
          fname: data.firstName,
          lname: data.lastName
        }
        users.push(user)
      })
      response.status(http.ok).json({ users: users })  // will be accessed as data_from_backend in prev code blocks
    }).catch((error) => {
      console.log('Error getting documents', error)
      response.status(http.conflict).json(null)
    })
  })
  
  module.exports = router