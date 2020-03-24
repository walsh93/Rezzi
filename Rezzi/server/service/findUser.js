const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys


const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi
  console.log(rezzi);
  let hd = '';
  db.collection(keys.rezzis).doc(rezzi).get().then(doc => {
    const data = doc.data()
    console.log(data)
    hd = data.HD;

    console.log('hd:' + hd);

    let users = [];
    console.log('waewfeew');
    // console.log(request.body);
    // let email = request;
    // let usersref = db.collection('users').doc(email).get();
    db.collection('users').doc(hd).get().then(doc => {
      const data = doc.data()
      console.log(data);



      response.status(http.ok).json({ hd: hd })  // will be accessed as data_from_backend in prev code blocks

    }).catch((error) => {
      console.log('Error getting documents', error)
      response.status(http.conflict).json(null)
    })
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
});
// console.log(usersref);

//let query = usersref.doc(email).collection(keys.)

// db.collection('users').get().then((doc) => {
//   if (!doc.exists) {
//     console.log('User doc not found')
//     response.status(http.bad_request).send('Error retrieving user information')
//   } else  {
//     const data = doc.data()
//     console.log(data)
//     users = data.users
//     for(var i = 0; i < users.length; i++){
//     }
//   }

//   snapshot.forEach((user) => {
//     if (user.data.email == request.email) {
//       const data = user.data()
//       const user = {
//         deletionRequests: data.deletionRequests,
//       }
//       users.push(user)
//     }

//   })

// response.status(http.ok).json({ users: users })  // will be accessed as data_from_backend in prev code blocks
//   }).catch((error) => {
//     console.log('Error getting documents', error)
//     response.status(http.conflict).json(null)

// });



module.exports = router;
