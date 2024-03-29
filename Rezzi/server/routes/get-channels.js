const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const keys = require('../constants').db_keys

router.get('/', checkCookie, function(request, response) {
  const req = request.body;
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

    // Get channels they can belong to
    const prefix = keys.rezzis + '/' + rezzi + '/';

    function queryDb(collection, name) {
      return new Promise((resolve, reject) => {
        var to_add = {
          parent: name,
          channels: {}
        };
        db.collection(collection).select('members', 'approvalStatus', 'memberMuteStatuses').get().then(function(snapshot) {
          snapshot.forEach(function(doc) {
            const data = doc.data()
            let temp = {}

            // Only show this channel if it has been approved by an RA
            if (data.approvalStatus == true) {
              if (data.hasOwnProperty('members')) {
                temp.users = data.members.length;
                temp.belongs = (data.members.indexOf(email) === -1) ? false : true;
              } else {
                temp.users = 0;
                temp.belongs = false;
              }

              temp.isMuted = false
              if (data.hasOwnProperty('memberMuteStatuses')) {
                for (let k = 0; k < data.memberMuteStatuses.length; k++) {
                  if (data.memberMuteStatuses[k].email == email) {
                    temp.isMuted = data.memberMuteStatuses[k].isMuted
                    break
                  }
                }
              }

              if (data.hasOwnProperty('messages')) {
                temp.messages = data.messages
              } else {
                temp.messages = []
              }
              to_add.channels[doc.id] = temp;
            } else {
              console.log(`Skipping unapproved channel ${doc.id}...`)
            }
          });
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
      response.status(200).json(to_return);
    })
  });
})

 module.exports = router;
