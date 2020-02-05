// Import HTTP codes
const codes = require('./constants')

// Get firebase admin library
const admin = require('firebase-admin');

// Initialize firebase admin client
const serviceAccount = require('./rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rezzi-33137.firebaseio.com"
  });

console.log('Database client seems to be working');

db = admin.database();

module.exports = {
  admin: admin,
  db: db
};