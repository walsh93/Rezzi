const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const db = admin.firestore()

const indexFile = require('../constants').indexFile
const http = require('../constants').http_status
const keys = require('../constants').db_keys

router.get('/users/:userCount', function(request, response) {
  const EMAIL_SITE = "programmatictesting.com";
  const REZZI_NAME = "Programmatic Test Rezzi";
  const FLOOR_NAME = "Test Floor";
  const RA_EMAIL = "testra@" + EMAIL_SITE;
  const ADMIN_EMAIL = "testadmin@" + EMAIL_SITE;

  console.log("Setting up test environment...");
  console.log("User count:", request.params.userCount);
  console.log("Creating users:");
  let data = {
      email: ADMIN_EMAIL,
      password: "12341234",
      verified: true,
      accountType: 0,
      rezzi: REZZI_NAME,
      age: 20,
      bio: "This is purely a test admin user account",
      firstName: "TestAdmin",
      lastName: "TestLastName",
      major: "Test Major",
      nickName: "TestAdmin Nickname",
      channels: [
        "hallwide-General",
        "floors-" + FLOOR_NAME + "-General",
        "RA-General"
      ],
      calendar: [],
  };
  // Creating HD
  db.collection(keys.users).doc(ADMIN_EMAIL).set(JSON.parse(JSON.stringify(data))).then(response => {
    console.log("\tCreated admin as " + ADMIN_EMAIL);
  });

  // Creating RA
  data.email = RA_EMAIL;
  data.accountType = 1;
  data.firstName = "TestRA";
  data.nickName = "TestRA Nickname";
  data.bio = "This is purely a test RA user account";
  data.floor = FLOOR_NAME;
  db.collection(keys.users).doc(RA_EMAIL).set(JSON.parse(JSON.stringify(data))).then(response => {
    console.log("\tCreated RA as " + RA_EMAIL)
  });;

  // Creating Users
  data.accountType = 2;
  data.channels = [
    "hallwide-General",
    "floors-" + FLOOR_NAME + "-General"
  ];
  data.bio = "This is purely a test normal user account";
  let resident_list = [];
  for (let i = 0; i < request.params.userCount; i++) {
    data.email = "test" + i.toString() + "@" + EMAIL_SITE;
    resident_list.push(data.email);
    data.firstName = "Test" + i.toString();
    data.nickName = "Test" + i.toString() + " Nickname";
    db.collection(keys.users).doc(data.email).set(JSON.parse(JSON.stringify(data))).then(response => {
      console.log("\tCreated user" + i.toString() + " as test" + i.toString() + "@" + EMAIL_SITE)
    });
  }

  // Creating Rezzi
  console.log("Creating Rezzi");
  db.collection(keys.rezzis).doc(REZZI_NAME).set({
    HD: ADMIN_EMAIL,
    RA_list: [
      RA_EMAIL
    ],
    resident_list: resident_list
  }).then(response => {
    console.log("\tCreated Rezzi as " + REZZI_NAME);
  });

  // Creating Channels
  data = {
    approvalStatus: true,
    calendar: [],
    description: "Hallwide General Channel",
    level: "hallwide",
    members: resident_list.concat([RA_EMAIL, ADMIN_EMAIL]),
    messages: [],
    owner: ADMIN_EMAIL,
    title: "General"
  }
  db.collection(keys.rezzis + '/' + REZZI_NAME + '/hallwide').doc("General").set(JSON.parse(JSON.stringify(data))).then(response => {
    console.log("\tCreated Hallwide General Channel")
  });

  data.description = "RA General Channel";
  data.level = "RA";
  data.members = [RA_EMAIL, ADMIN_EMAIL];
  db.collection(keys.rezzis + '/' + REZZI_NAME + '/RA').doc("General").set(JSON.parse(JSON.stringify(data))).then(response => {
    console.log("\tCreated RA General Channel")
  });

  db.collection(keys.rezzis + '/' + REZZI_NAME + '/floors').doc(FLOOR_NAME).set({
    residents: resident_list
  }).then(response => {
    console.log("\tFloor " + FLOOR_NAME + " created");
  
    data.description = FLOOR_NAME + " General Channel";
    data.level = "floor";
    data.members = resident_list.concat([RA_EMAIL, ADMIN_EMAIL]);
    db.collection(keys.rezzis + '/' + REZZI_NAME + '/floors/' + FLOOR_NAME + '/channels').doc("General").set(JSON.parse(JSON.stringify(data))).then(response => {
      console.log("\tCreated floor channel General for floor " + FLOOR_NAME)
    });
  });
})

module.exports = router
