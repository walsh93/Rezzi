const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {
  db.collection('users').doc(request.__session.email).get().then((doc) => {
    const data = doc.data()
    console.log(data)

    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      major: data.major,
      nickName: data.nickName,
      bio: data.bio,
      age: data.age,
      deletionRequest: data.deletionRequest,
      email: data.email,
      rezzi: data.rezzi,
      floor: data.floor  // For request-channel
    }
    response.status(http.ok).json({ user: user })  // will be accessed as data_from_backend in prev code blocks
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
});



module.exports = router;
