// // Dependencies
// var express = require('express');
// var router = express.Router();
// const admin = require('firebase-admin');
// const db = admin.firestore();

// const checkCookie = require('../permissions').userNeedsToBeLoggedIn
// const indexFile = require('../constants').indexFile
// const http = require('../constants').http_status
// const keys = require('../constants').db_keys
// const sign_in = require('../constants').sign_in
// const url = require('../constants').url

// router.get('/', checkCookie, function(request, response) {
//   const req = request.body;
//   const email = request.__session.email;

//   //get the rezzi the user belongs to
//   var userrezzi = '';
//   db.collection(keys.users).doc(email).get().then(doc => {
//     //get name of rezzi
//     if(doc.exists){
//       userrezzi = doc.data().rezzi;
//     }

//   });

//   // {rezzi}.floors
//   const prefix = '/' + userrezzi + '/' + 'floors';
//   //TO DO: Here is where I gave up Help needed
//     db.collection('residence-halls').get(prefix).then((snapshot) => {
      
  
//       // let floors = []
//       // snapshot.forEach((floor) => {
//       //   const data = user.data()
//       //   const user = {
//       //     fname: data.firstName,
//       //     lname: data.lastName
//       //   }
//       //   users.push(user)
//       // })
//       response.status(http.ok).json({ users: users })  // will be accessed as data_from_backend in prev code blocks
//     }).catch((error) => {
//       console.log('Error getting documents', error)
//       response.status(http.conflict).json(null)
//     })
//   })
  
//   module.exports = router