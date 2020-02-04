//Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');

//Firebase
const admin = require('firebase-admin');
const serviceAccount = require('./rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rezzi-33137.firebaseio.com"
  });
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);


const http = require('http');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//sessions here

const port = process.env.PORT || 4100;

app.listen(port);
console.log("Server started on port " + port);