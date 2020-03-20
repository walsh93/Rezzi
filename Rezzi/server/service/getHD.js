const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status;
const keys = require('../constants').db_keys;


const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
router.get('/', checkCookie, function (request, response) {
  console.log("HERi!!!!!")
    const rezzi = request.__session.rezzi
  console.log(rezzi);

  db.collection(keys.rezzis).doc(rezzi).get().then(doc => {
    console.log("HERW!!!!!")

    const data = doc.data()
    console.log("gethd:")
    console.log(data)
    console.log('endhd')
    const hd = data.HD.email;

    console.log('hd:' + hd);


  response.status(http.ok).json({ hd: hd })  // will be accessed as data_from_backend in prev code blocks

}).catch((error) => {
  console.log('Error getting documents', error)
  response.status(http.conflict).json(null)
})
});




module.exports = router;
