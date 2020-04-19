// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInAdmin
const http = require('../constants').http_status
const keys = require('../constants').db_keys

/**
 * GET method for no parameters - this should be called if all floors are wanted
 * This should be called if a hall director is logged in and they need to get all the RAs and
 * all the residents on a floor.
 */
router.get('/', checkCookie, function(request, response) {
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

    // Combine arrays of residents and RAs, loop through each of their documents and pull data
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

    // Handle all promises
    Promise.all(promises).then((resolved) => {
      response.status(http.ok).json({ infoList: residentAndRaInfo, floors: floors })
    }).catch((reject) => {
      response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
    })
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

/**
 * GET method for no parameters - this should be called if specific floor is wanted
 */
router.get('/:floor', checkCookie, function(request, response) {
  const rezziDocRef = db.collection(keys.residence_halls).doc(request.__session.rezzi)
  rezziDocRef.collection(keys.floors).doc(request.params.floor).get().then((floorDoc) => {
    // Check that document exists
    if (!floorDoc.exists) {
      response.status(http.not_found).json({ msg: 'The document for this floor could not be found.' })
      return
    }

    // Check that resident list exists in the document
    const floorData = floorDoc.data()
    const residents = floorData.residents
    if (floorData.residents == null || floorData.residents === undefined) {
      response.status(http.not_found).json({ msg: 'The list of residents for this floor could not be found.' })
      return
    }

    // Initialize empty arrays
    let residentInfo = [];  // This is the array to return in the response
    let promises = [];

    // Loop through each resident document and pull data
    for(let i = 0; i < residents.length; i++) {
      const residentPromise = db.collection(keys.users).doc(residents[i]).get().then((residentDoc) => {
        if (!residentDoc.exists) {
          console.log(`Firestore document for ${residents[i]} could not be found.`)
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
          residentInfo.push(info)
        }
      })
      promises.push(residentPromise)
    }

    // Handle all promises
    Promise.all(promises).then((resolved) => {
      response.status(http.ok).json({ infoList: residentInfo })
    }).catch((reject) => {
      response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
    })
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
