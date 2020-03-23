
// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {
  let RAs = [];
  let RAInfo = [];
  //access collection of current user's rezzi
  db.collection('residence-halls').doc(request.__session.rezzi).get().then((doc) => {
    if (!doc.exists) {
        console.log('RA list Doc not found')
        response.status(http.bad_request).send('Error retrieving RA information')
      } else  {
        const data = doc.data()
        //console.log(data)
        RAs = data.RA_list
        //for every RA email in the RA_list array
        for(var i = 0; i < RAs.length; i++){
            
            db.collection('users').doc(RAs[i]).get().then((doc) => {
                if(!doc.exists){
                    console.log('RA Email Doc not found')
                    response.status(http.bad_request).send('Error retrieving RA information')
                }
                const data = doc.data()
                //If more info is needed on the User Management page, add that here!
                const info = {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    verified: data.verified,
                    floor: data.floor,
                }
                //console.log(info)
                RAInfo.push(info)
                //console.log(RAInfo.length)
            }).catch((error) => {
                console.log('Error getting documents', error)
                response.status(http.conflict).json(null)
              })
        }
        response.status(http.ok).json({ RAInfo: RAInfo })  // will be accessed as data_from_backend in prev code blocks

      }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })

})

module.exports = router