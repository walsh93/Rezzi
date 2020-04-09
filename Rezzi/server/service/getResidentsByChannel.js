// Dependencies
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkCookie = require('../permissions').userNeedsToBeLoggedInAdmin
const http = require('../constants').http_status
const keys = require('../constants').db_keys

/**
 * GET method expects a parameter. Make sure to pass the channel ID parameter whenever a get request
 * is made to this URL
 */
router.get('/:channelID', checkCookie, function(request, response) {
  const channelID = request.params.channelID

  // Extract ID data to get channel document reference
  let channelDocRef = null
  if (channelID.indexOf("floors") !== -1) {
    const firstDash = channelID.indexOf('-')
    const secondDash = channelID.indexOf('-', firstDash + 1)
    const floorName = channelID.substring(firstDash + 1, secondDash)
    const channelName = channelID.substring(secondDash + 1)
    const chnPrefix = `${keys.residence_halls}/${request.__session.rezzi}/${keys.floors}/${floorName}/channels`
    channelDocRef = db.collection(chnPrefix).doc(channelName)
  } else {
    const firstDash = channelID.indexOf('-')  // The "only" dash in a hallwide channel ID
    const channelName = channelID.substring(firstDash + 1)
    const rezPrefix = `${keys.residence_halls}/${request.__session.rezzi}/hallwide`
    channelDocRef = db.collection(rezPrefix).doc(channelName)
  }

  channelDocRef.get().then((channelDoc) => {
    // Check that document exists
    if (!channelDoc.exists) {
      response.status(http.not_found).json({ msg: 'The document for this channel could not be found.' })
      return
    }

    // Check that resident list exists in the document
    const channelData = channelDoc.data()
    const members = channelData.members
    if (channelData.members == null || channelData.members === undefined) {
      response.status(http.not_found).json({ msg: 'The list of members in this channel could not be found.' })
      return
    }

    // Initialize empty arrays
    let memberInfo = [];  // This is the array to return in the response
    let promises = [];

    // Loop through each resident document and pull data
    for(let i = 0; i < members.length; i++) {
      const memberPromise = db.collection(keys.users).doc(members[i]).get().then((memberDoc) => {
        if (!memberDoc.exists) {
          console.log(`Firestore document for ${members[i]} could not be found.`)
        } else {
          const memberData = memberDoc.data()

          // Declare variables for each resident
          let firstName;
          let lastName;

          // Set default values in case any database values are missing or not set
          if (memberData.firstName == null || memberData.firstName === undefined) {
            firstName = "NA";
          } else {
            firstName = memberData.firstName;
          }

          if (memberData.lastName == null || memberData.lastName === undefined) {
            lastName = "NA";
          } else {
            lastName = memberData.lastName;
          }

          // Add info to info array
          const info = {
            email: memberData.email,
            firstName: firstName,
            lastName: lastName,
            isMuted: false,
          }
          memberInfo.push(info)
        }
      })
      promises.push(memberPromise)
    }

    // Handle all promises
    Promise.all(promises).then((resolved) => {
      response.status(http.ok).json({ infoList: memberInfo })
    }).catch((reject) => {
      response.status(http.error).json({ reject: reject, msg: 'Something went wrong. Please try again later.' })
    })
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
