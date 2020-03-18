const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const checkCookie = require("../permissions").userNeedsToBeLoggedInHD;
const indexFile = require("../constants").indexFile;
const http = require("../constants").http_status;
const keys = require("../constants").db_keys;
const invite_users = require("../constants").invite_users;
const c = require("../constants");

const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

router.get("/", checkCookie, function(request, response) {
  response.sendFile(indexFile);
}).post("/", function(request, response) {
  console.log(request.body);
  const rb = request.body;
  const emailarr = rb.emailList.split(",");

  db.collection(keys.users).doc(request.__session.email).get().then((doc) => {
    const rezzi = doc.data().rezzi  // rezzi can't be added to session later on so this will have to do for now
    //for each email in the array, need to save to the db a new user with email, role, floor, rezzi, verified = 0, and pword code

    //adding users to list of users in their floor
    const floorDocRef = db.collection(keys.rezzis + '/' + rezzi + '/floors').doc(rb.floor)
    floorDocRef.get().then((floorDoc) => {
      const residentsAlreadyInRezzi = floorDoc.data().residents
      const fullArray = residentsAlreadyInRezzi.concat(emailarr)
      floorDocRef.update({
        residents: fullArray
      })
    })
    
    //adding users to floor general chat
    const floorGeneralDocRef = db.collection(keys.rezzis + '/' + rezzi + '/floors/' + rb.floor + '/channels').doc('General')
    floorGeneralDocRef.get().then((floorChannelsDoc) => {
      const membersAlreadyInRezzi = floorChannelsDoc.data().members
      const fullArray = membersAlreadyInRezzi.concat(emailarr)
      floorGeneralDocRef.update({
        members: fullArray
      })
    })

    //adding new RAs to RA general channel
    if (rb.accountType == 1) {
      const raGeneralDocRef = db.collection(keys.rezzis + '/' + rezzi + '/RA').doc('General')
      raGeneralDocRef.get().then((raGeneralDoc) => {
        const residentsAlreadyInRezzi = raGeneralDoc.data().members
        const fullArray = residentsAlreadyInRezzi.concat(emailarr)
        raGeneralDocRef.update({
          members: fullArray
        })
      })
    }

    //adds all users to hallwide general channel
    const hallGeneralDocRef = db.collection(keys.rezzis + '/' + rezzi + '/hallwide').doc('General')
    hallGeneralDocRef.get().then((hallGeneralDoc) => {
      const membersAlreadyInRezzi = hallGeneralDoc.data().members
      const fullArray = membersAlreadyInRezzi.concat(emailarr)
      hallGeneralDocRef.update({
        members: fullArray
      })
    })

    //Add users to list of members for rezzi
    const rezziDocRef = db.collection(keys.rezzis).doc(rezzi)
    rezziDocRef.get().then((rezziDoc) => {
      
      //if user is RA, add to RA list
      if(rb.accountType == 1){
        const listofRAs = rezziDoc.data().RA_list
        const fullArray = listofRAs.concat(emailarr)
        rezziDocRef.update({
          RA_list: fullArray
        })

      }
      else if(rb.accountType == 2){
        const listofResidents = rezziDoc.data().resident_list
        const fullArray = listofResidents.concat(emailarr)
        rezziDocRef.update({
          resident_list: fullArray
        })
      }
    })

    for (var i = 0; i < emailarr.length; i++) {
      var tempPword = randomstring.generate();
      var currentEmail = emailarr[i];
      /*
        if (db.collection('users').doc(currentEmail).get()){
          console.log("EXISTS");
          continue;
        }
          TODO: Determine how to check to see if email exists
        */
      /*db.collection('users').doc(currentEmail).get().then(doc => {
          if(doc.exists){
            response.send(c.EMAIL_ALREADY_REGISTERED)
          } else {
            //put things in database*/
      console.log(rb.floor);

      db.collection(keys.users).doc(currentEmail).set({
        email: currentEmail,
        password: tempPword,
        verified: false,
        accountType: parseInt(rb.accountType),
        floor: rb.floor,
        rezzi: rezzi,
        channels: rb.channels
      });

      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "rezzi407@gmail.com",
          pass: "cs407Project!"
        }
      });

      var mailOptions = {
        to: currentEmail,
        from: rezzi + " Rezzi <rezzi407@gmail.com>",
        subject: rezzi + " Rezzi Sign-up",
        text:
          "Welcome to Rezzi!\n\nYour hall director has just invited you to the " + rezzi + " Rezzi\n\n" +
          "To complete the set up procces and activate your account, visit http://localhost:4100/sign-in and use the following credentials:\n\n" +
          "email: " + currentEmail + "\npassword: " + tempPword + "\n\nYou will be directed to set up your profile and change your password\n\n" +
          "Have fun connecting with your friends in " + rezzi + " this year!"
      };

      smtpTransport.sendMail(mailOptions, function(error, res) {
        if (error) {
          console.log(`There was an error sending email to ${currentEmail}`)
        } else {
          console.log(`I think we successfully sent an email to ${currentEmail}...???!!!`)
        }
      });
    }

    response.status(http.ok).send("Your email list is currently being processed and will be sent our shortly.")
  })
});

module.exports = router;
