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
    dbstore.collection('users').doc(data.email).get().then(doc => {
      if (doc.exists && doc.data().verified == true) {
        //Do something about the error here
        //checks to see if account is verified per Megan's implementation
      } else if (doc.exists) {
        dbstore.collection('users').doc(data.email).update(data)
      } else {
        //Should NEVER get here. Only for SignUpHD
        dbstore.collection('users').doc(data.email).set(data)
      }
    }).catch(err => {
      //reject(err)
      console.log(err)
      console.log("Error creating account");
    })
}

module.exports.getUser = function getUser(data){
  dbstore.collection('users').doc(data.email).get().then(doc => {
    console.log("GET: " + dbstore.collection('users').doc.data());

    if (!doc.exists) {
      //Do something about the error here

    } else {
    //  return dbstore.collection('users').doc(email).get(data)
    (function() {
    console.log("GET: " + dbstore.collection('users').doc.data());
    }).call();

    return dbstore.collection('users').doc(email)
    }
  }).catch(err => {
    //reject(err)
    console.log(err)
    console.log("Error getting user's profile");
  })
}
// module.exports.editUser = function editUser(data){
//   dbstore.collection('users').doc(data.email).get().then(doc => {
//     if (!doc.exists) {
//       //Do something about the error here
//       //checks to see if account is verified per Megan's implementation
//     } else {
//       dbstore.collection('users').doc(email).update(data)
//     }
//   }).catch(err => {
//     //reject(err)
//     console.log(err)
//     console.log("Error editing account");
//   })
// }
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
