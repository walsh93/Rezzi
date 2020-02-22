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
    const prefix = keys.rezzis + '/' + rezzi + '/';

    function queryDb(collection, name) {
      return new Promise((resolve, reject) => {
        var to_add = {
          parent: name,
          channels: {}
        };
        db.collection(collection).select('members').get().then(function(snapshot) {
          console.log(collection);  // Debugging
          snapshot.forEach(function(doc) {
            temp = {
              belongs: false
            }
            if (doc.data().hasOwnProperty('members')) {
              temp.users = doc.data().members.length;
            }
            else {
              temp.users = 0;
            }
            to_add.channels[doc.id] = temp;
          });
          console.log(to_add);
          resolve(to_add);
        }).catch(function(rejection) {
          console.log(collection + " --- ERROR:", rejection);  // Debugging output
          resolve(to_add);
        })
      })
    }
    var promises = [queryDb(prefix + 'hallwide', 'hallwide'), queryDb(prefix + 'floors/' + floor + '/channels', 'floors-' + floor)];
    if (user_type < 2) {
      promises.push(queryDb(prefix + 'RA', 'RA'));
    }
    Promise.all(promises).then(responses => {
      var to_return = {};
      responses.forEach((response) => {
        to_return[response.parent] = response.channels;
      });
      console.log(to_return);

      // Check for channels they belong to and set flags accordingly
      belongs_to.forEach((channel) => {
        var parent = channel.split('-')[0];
        var name = channel.split('-')[1];
        if (channel.includes('floors')) {
          parent = 'floors-' + name;
          name = channel.replace(parent + '-', '');
        }
        to_return[parent][name].belongs = true;
      })
      response.status(200).json(to_return);
    })
  });
})

module.exports = router