const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()
const http = require('../constants').http_status
const keys = require('../constants').db_keys

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified

router.get('/', checkCookie, function (request, response) {
    let panelInfo = [];
    let promises = [];
    const email = request.__session.email;

    db.collection(keys.users).doc(email).collection('Notifications').get().then((snapshot) => {
        snapshot.forEach((channelDoc) => {
            const docData = channelDoc.data()
            
            const info = {
                channel: channelDoc.id,
                muted: docData.muted,
                notifications: docData.notifications,
            }
            console.log(info)
            panelInfo.push(info)
        })
        response.status(200).json({panelInfo: panelInfo});
    }).catch((error) => {
    console.log('Error fetching panel info', error)
    response.status(http.conflict).json(null)
  })
});

module.exports = router;