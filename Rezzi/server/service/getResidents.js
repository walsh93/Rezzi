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
  let residents = [];
  let residentInfo = [];
  db.collection('residence-halls').doc(request.__session.rezzi).get().then((doc) => {
    if (!doc.exists) {
        console.log('Resident list Doc not found')
        //response.status(http.bad_request).send('Error retrieving resident information')
      } else  {
        const data = doc.data()
        console.log(data)
        residents = data.resident_list
        let promises = [];

        for(var i = 0; i < residents.length; i++){ 
            //declare variables for each resident
            var firstName;
            var lastName;
            promises.push(db.collection('users').doc(residents[i]).get().then((doc) => {
                if(!doc.exists){
                    console.log('resident Email Doc not found')
                    //response.status(http.bad_request).send('Error retrieving resident information')
                }
                const data = doc.data()

                //if a value is undefiened because it is an unregistered user, save value as "N/A"
                if(data.firstName === undefined){
                    firstName = "NA";
                }
                else{
                    firstName = data.firstName;
                }

                if(data.lastName === undefined){
                    lastName = "NA";
                } 
                else {
                    lastName = data.lastName;
                }

                const info = {
                    email: data.email,
                    firstName: firstName,
                    lastName: lastName,
                    verified: data.verified,
                    floor: data.floor,
                }
                console.log(info)
                residentInfo.push(info)
                //console.log(RAInfo.length)
            }))
        }

        Promise.all(promises).then((resolved) => {
          response.status(http.ok).json({ residentInfo: residentInfo })  // will be accessed as data_from_backend in prev code blocks
        }).catch((reject) => {
          response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
        })
      }
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })

})

module.exports = router