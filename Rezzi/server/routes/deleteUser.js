const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.post('/', function(request, response) {
  const rb = request.body
  email = rb.email
  rezzi = rb.rezzi
  hdemail = rb.hdemail
  const docRef = db.collection(keys.users).doc(email)
  const rezziRef = db.collection(keys.rezzis).doc(rezzi)
  const hdDocRef = db.collection(keys.users).doc(hdemail)

  const role = docRef.accountType

  let promises = []

  //Delete from list of residents or RAs in hall
  if(role == 1){
    promises.push(rezziRef.update({
        RA_list: admin.firestore.FieldValue.arrayRemove(email),
    }))
  }
  else if(role == 2){
    promises.push(rezziRef.update({
        resident_list: admin.firestore.FieldValue.arrayRemove(email),
    }))
  }

  //loop through each channel in their channel list and remove them from the members list
  let channels = []
  channels = docRef.channels

  for(var i = 0; i < channels.length; i++){
      promises.push()
  }



  //remove them from the User class
  promises.push(docRef.delete())

  //remove them from the list of users to be deleted in the HD user doc
  promises.push(hdDocRef.update({
    deletionRequests: admin.firestore.FieldValue.arrayRemove(email),
    
  }))

  //Send response when all promises are completed
  Promise.all(promises).then((resolved) => {
    response.status(http.ok).json({ resolved, msg: 'User has been deleted' })
  }).catch((reject) => {
    response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
  })

  
})

module.exports = router;
