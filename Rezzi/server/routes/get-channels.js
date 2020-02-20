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

    // Get rezzis they can belong to
    var can_belong_to = [];
    const prefix = keys.rezzis + '/' + rezzi + '/';

    function queryDb(collection) {
      to_add = [];
      var should_return = false;
      db.collection(collection).select('members').get().then(function(snapshot) {
        console.log(collection);  // Debugging
        snapshot.forEach(function(doc) {
          temp = {
            channel: doc.id
          }
          if (doc.data().hasOwnProperty('members')) {
            temp.users = doc.data().members.length;
          }
          else {
            temp.users = 0;
          }
          to_add.push(temp);
        });
        console.log(to_add);
        should_return = true;
      }).catch(function(rejection) {
        console.log(collection + " --- ERROR:", rejection);  // Debugging output
        should_return = true;
      })
      while (should_return == false) {}
      return to_add;
    }

    can_belong_to.concat(queryDb(prefix + 'hallwide'));
    can_belong_to.concat(queryDb(prefix + 'floors/' + floor + '/channels'));
    if (user_type < 2) {
      can_belong_to.concat(queryDb(prefix + 'RA'))
    }
    console.log("All queries completed");
    console.log(can_belong_to);

  });
})

module.exports = router