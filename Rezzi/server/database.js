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
        //checks to see if account is verified per Megan's implementation
        reject(c.EMAIL_ALREADY_REGISTERED)
      } else {
        dbstore.collection('users').doc(data.email).update(data)
        resolve(c.HTTP_CREATED)
      }
    }).catch(err => {
      //reject(err)
      console.log("Error creating account");
    })
}

module.exports.editUser = function(editUser) {
  
}
