const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const edit_profile = require('../constants').edit_profile

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

// router.get('/', checkCookie, function(request, response) {
//   response.sendFile(indexFile)
// }).post('/', function(request, response){
//   const req= request.body;
//   db.collection(keys.users).where(keys.email, '==', data.email).get().then((snapshot)=>{
//     if (snapshot.docs.length == 1) {
//       const data = snapshot.docs[0].data()
//     }
//   })
// })



module.exports = router
