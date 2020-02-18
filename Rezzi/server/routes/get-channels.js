const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedIn
const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys
const sign_in = require('../constants').sign_in
const url = require('../constants').url

router.get('/', checkCookie, function(request, response) {
  const req = request.body;
  // console.log("Request: " + request.__session);
  const email = request.__session.email;
  
  // Get rezzis the user belongs to
  var rezzi = '';
  var belongs_to = [];
  var user_type = -1;
  var floor = '';
  db.collection(keys.users).doc(email).get().then(doc => {
  	if (doc.exists) {
	  belongs_to = doc.data().channels;
	  rezzi = doc.data().rezzi;
	  user_type = doc.data().accountType;
	  floor = doc.data().floor;
	}
  });

  // Get rezzis they can belong to
  var can_belong_to = [];
  let rezzi_collection = db.collection(keys.rezzis).collection(rezzi);

  rezzi_collection.collection('floors').doc().get().then(doc => {
  	if (doc.exists) {
  	  doc.collection('floors').doc(floor).get().then(floor_doc => {
  	  	if (floor_doc.exists) {
	  	  can_belong_to.concat(floor_doc.data().channels)
	  	}
  	  });
  	}
  });
})

module.exports = router