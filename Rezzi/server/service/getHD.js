const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys;


const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
router.get('/', checkCookie, function (request, response) {
  const rezzi = request.__session.rezzi
  console.log(rezzi);

  db.collection(keys.rezzis).doc(rezzi).get().then(doc => {
    const data = doc.data()
    console.log(data)
    const hd = data.HD;

    console.log('hd:' + hd);

    // db.collection('users').get().then((snapshot) => {
    //   let users = []
    //   snapshot.forEach((user) => {
    //     const data = user.data()
    //     console.log(data);
    //     const info = {
    //       firstName: data.firstName,
    //       lastName: data.lastName,
    //       password: data.password,
    //       major: data.major,
    //       nickname: data.nickname,
    //       bio: data.bio,
    //       age: data.age,
    //     }

    //     users.push(info)
    //   })
    // });

    response.status(http.ok).json({ hd: hd })  // will be accessed as data_from_backend in prev code blocks

  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
});




module.exports = router;
