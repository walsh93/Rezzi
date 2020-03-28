const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const checkCookie = require('../permissions').userNeedsToBeLoggedInAndVerified
const keys = require('../constants').db_keys

router.get('/', checkCookie, function (request, response) {
  console.log("get-non-pm-users.js");
  const req = request.body;
  const email = request.__session.email;
  const rezzi = request.__session.rezzi;
  i = 0;
  pmusers = [];
  users = [];
  let usersRef = db.collection(keys.users);

  let query1 = usersRef.doc(email).collection(keys.private_messages).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        pmusers.push(doc.id);
      })
    })

  let query2 = usersRef.where('rezzi', '==', rezzi).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach(doc => {
        if(doc.id != email){
        users.push(doc.id);
        }
        //console.log(doc.id, '=>', doc.data())
      })
      console.log("PMUSERS",pmusers)
      console.log("USERS",users);
      users = users.filter(function(val) {
        return pmusers.indexOf(val) == -1;
      })
      console.log("PMUSERS",pmusers)
      console.log("USERS",users);
      response.status(200).json(users);
    })
  /*
db.collection(keys.users).doc(email).collection(keys.private_messages).get()
.then(snapshot => {
  snapshot.forEach(doc =>{
    temp = {};
    temp.recipient = doc.id;
    temp.messages = doc.data();
    privateMessagesData[i] = temp;
    i++;
    //console.log(doc.id, "=>", doc.data(), "i:",i)
  })
  //console.log("PLZ WORK:", privateMessagesData);
  response.status(200).json(privateMessagesData);
})*/
})

module.exports = router;
