// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInHD
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/:floor', checkCookie, function(request, response) {
  if (request.params.floor.toLowerCase() == 'all') {  // Get all residents and RAs in entire Rezzi
    const rezziDocRef = db.collection(keys.residence_halls).doc(request.__session.rezzi)
    rezziDocRef.get().then((rezziDoc) => {
      // Check that document exists
      if (!rezziDoc.exists) {
        response.status(http.not_found).json({ msg: 'The document for this Rezzi could not be found.' })
        return
      }

      // Check that resident and RA lists exist in the document
      const rezziData = rezziDoc.data()
      if (rezziData.resident_list == null || rezziData.resident_list === undefined) {
        response.status(http.not_found).json({ msg: 'The list of residents for this Rezzi could not be found.' })
        return
      }
      if (rezziData.RA_list == null || rezziData.RA_list === undefined) {
        response.status(http.not_found).json({ msg: 'The list of residents for this Rezzi could not be found.' })
        return
      }

      // Initialize empty arrays
      let residentAndRaInfo = [];  // This is the array to return in the response
      let floors = [];
      let promises = [];

      // Combine arrays of residents and RAs, loop through each of their document and pull data
      const residentsAndRas = rezziData.RA_list.concat(rezziData.resident_list)
      for(let i = 0; i < residentsAndRas.length; i++) {
        const residentPromise = db.collection(keys.users).doc(residentsAndRas[i]).get().then((residentDoc) => {
          if (!residentDoc.exists) {
            console.log(`Firestore document for ${residentsAndRas[i]} could not be found.`)
          } else {
            const residentData = residentDoc.data()

            // Declare variables for each resident
            let firstName;
            let lastName;
            let canPost;

            // Set default values in case any database values are missing or not set
            if (residentData.firstName == null || residentData.firstName === undefined) {
              firstName = "NA";
            } else {
              firstName = residentData.firstName;
            }

            if (residentData.lastName == null || residentData.lastName === undefined) {
              lastName = "NA";
            } else {
              lastName = residentData.lastName;
            }

            if (residentData.canPost == null || residentData.canPost === undefined) {
              canPost = true;
            } else {
              canPost = residentData.canPost;
            }

            // Add info to info array
            const info = {
              email: residentData.email,
              firstName: firstName,
              lastName: lastName,
              accountType: residentData.accountType,
              floor: residentData.floor,
              canPost: canPost,
            }
            residentAndRaInfo.push(info)
          }
        })
        promises.push(residentPromise)
      }

      // Get list of floor names
      const floorPromise = rezziDocRef.collection(keys.floors).get().then(snapshot => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          floors.push(snapshot.docs[i].id)
        }
      })
      promises.push(floorPromise)

      Promise.all(promises).then((resolved) => {
        response.status(http.ok).json({ infoList: residentAndRaInfo, floors: floors })
      }).catch((reject) => {
        response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
      })
    }).catch((error) => {
      console.log('Error getting documents', error)
      response.status(http.conflict).json(null)
    })
  } else {
    console.log('Need to get by floor')  // TODO @Kai
  }
})

module.exports = router
