// Import HTTP codes
const c = require('./constants')

// Get firebase admin library
const admin = require('firebase-admin');

// Initialize firebase admin client
const serviceAccount = require('../rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rezzi-33137.firebaseio.com"
  });

console.log('Database client seems to be working');

db = admin.database();

dbstore = admin.firestore();

module.exports = {
  admin: admin,
  db: db
};

module.exports.addUser = function addUser(data) {
  return new Promise(function(resolve, reject) {
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

module.exports.editUser = function editUser(data,email){
  dbstore.collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      //Do something about the error here
      //checks to see if account is verified per Megan's implementation
    } else {
      dbstore.collection('users').doc(email).update(data)
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error editing account");
  })
}
module.exports.requestAccountDeletion = function requestAccountDeletion(data,email){
  dbstore.collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      //Do something about the error here
      //checks to see if account is verified per Megan's implementation
    } else {
      dbstore.collection('users').doc(email).update(data)
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error updating deletion status on account");
  })
}
