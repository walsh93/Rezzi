const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const checkCookie = require("../permissions").userNeedsToBeLoggedInHD;
const indexFile = require("../constants").indexFile;
const http = require("../constants").http_status;
const keys = require("../constants").db_keys;
const user_management= require("../constants").user_management;
const c = require("../constants");

const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

router.get("/", checkCookie, function(request, response) {
  response.sendFile(indexFile);
}).post("/", function(request, response) {
    
});

module.exports = router;