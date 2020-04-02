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
  let promises = []
  promises.push(db.collection(keys.users).doc(email).get().then((doc) => {
    const data = doc.data()
    const role = data.accountType
  const floor = data.floor
  console.log(floor)
  console.log(email)

  //Delete from list of residents or RAs in hall and 
  if(role == 1){
    promises.push(rezziRef.update({
        RA_list: admin.firestore.FieldValue.arrayRemove(email),
    }))

    //remove from list of RAs in the floor document
    promises.push(db.collection(keys.rezzis + '/' + rezzi + '/floors/' + floor).update({
        ras: admin.firestore.FieldValue.arrayRemove(email),
    }))

  }
  else if(role == 2){
    promises.push(rezziRef.update({
        resident_list: admin.firestore.FieldValue.arrayRemove(email),
    }))

    promises.push(db.collection(keys.rezzis + '/' + rezzi + '/floors/' + floor).update({
        residents: admin.firestore.FieldValue.arrayRemove(email),
    }))
  }

  //loop through each channel in their channel list and remove them from the members list
  let channels = []
  channels = data.channels
  console.log(channels)

  for(var i = 0; i < channels.length; i++){
    if (channels[i].indexOf("floors") !== -1) {
        promises.push(db.collection(keys.rezzis + '/' + rezzi + '/floors/' + channels[i].split('-')[1] + '/channels')
          .doc(channels[i].split('-')[2])    // TODO find way to include everything after this dash? Also in join-channel
          .update({
            members: admin.firestore.FieldValue.arrayRemove(email)
        }))
      }
      else {
        promises.push(db.collection(keys.rezzis + '/' + rezzi + '/' + channels[i].split('-')[0])
          .doc(channels[i].split('-')[1])
          .update({
            members: admin.firestore.FieldValue.arrayRemove(email)
        }))
      }
  }

  //remove them from the User class
  promises.push(doc.delete())

}))
  
  const rezziRef = db.collection(keys.rezzis).doc(rezzi)
  const hdDocRef = db.collection(keys.users).doc(hdemail)

  

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
