// Import HTTP codes
const c = require('./constants')
const db_keys = require('./constants').db_keys

// Get firebase admin library
const admin = require('firebase-admin');

// Initialize firebase admin client
const serviceAccount = require('../rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rezzi-33137.firebaseio.com"
});
const FieldValue = require('firebase-admin').firestore.FieldValue;

console.log('Database client seems to be working');

db = admin.database();

dbstore = admin.firestore();

module.exports = {
  admin: admin,
  db: db
};

module.exports.addUser = function addUser(data) {
  return new Promise(function (resolve, reject) {
    dbstore.collection('users').doc(data.email).get().then(doc => {
      if (doc.exists && doc.data().verified == true) {
        //Do something about the error here
        //checks to see if account is verified per Megan's implementation
        resolve(501)
      } else if (doc.exists) {
        dbstore.collection('users').doc(data.email).update(data)
        resolve(201)
      } else {
        //Should NEVER get here. Only for SignUpHD
        dbstore.collection('users').doc(data.email).set(data)
        console.log("Potential error when creating account (unless during sign-up-hd)")
        resolve(201)
      }
    }).catch(err => {
      reject(err)
      console.log(err)
      console.log("Error creating account");
    })
  })
}

module.exports.editUser = function editUser(data, email) {
  dbstore.collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      //Do something about the error here
    } else {
      dbstore.collection('users').doc(email).update(data)
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error editing account");
  })
}
module.exports.requestAccountDeletion = function requestAccountDeletion(data, email) {
  dbstore.collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      //Do something about the error here
    } else {
      dbstore.collection('users').doc(email).update(data)
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error updating deletion status on account");
  })
}
module.exports.updateHDArray = function updateHDArray(data,email, user) {
  console.log("qwwqdwqdw " + email + " " + user)
  dbstore.collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      //Do something about the error here
    } else {
      dbstore.collection('users').doc(email).update({'deletionRequests': FieldValue.arrayUnion(user)})
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error updating HD's deletion requests");
  })
}

module.exports.createChannelPath = function createChannelPath(rezzi, channelID) {
  if (channelID != null) {
    const resHallPath = `${db_keys.rezzis}/${rezzi}`
    let channelPath = null
    let channelName = null
    const level = channelID.split('-')[0]
    if (level === 'floors') {
      // does NOT consider whether floor name has a '-', but DOES consider if channel name has a '-'
      const firstDash = channelID.indexOf('-')
      const secondDash = channelID.indexOf('-', firstDash + 1)
      const floorName = channelID.slice(firstDash + 1, secondDash)
      channelName = channelID.slice(secondDash + 1)
      channelPath = `${resHallPath}/floors/${floorName}/channels`
    } else {  // either 'hallwide' or 'RA'
      const dash = channelID.indexOf('-')
      const hwOrRa = channelID.slice(0, dash)
      channelName = channelID.slice(dash + 1)
      channelPath = `${resHallPath}/${hwOrRa}`
    }

    if (channelPath == null || channelName == null) {
      return null
    }

    return { channelPath, channelName }
  }

  return null
}

//$$$conley
module.exports.createUserPath = function createUserPath(sender, receiver) {
  if (sender == null || receiver == null) {
    console.log("Path Creating Error");
    return null;
  }
  senderPath = `users/${sender}/private-messages`;
  receiverPath = `users/${receiver}/private-messages`;
  return { senderPath: senderPath, receiverPath: receiverPath };
}
//$$$conley
