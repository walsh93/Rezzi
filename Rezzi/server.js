//Express Setup
const express = require('express'),
    app = express();
const path = require('path');

// JSON Request Parser
const bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

//Sessions
const sessions = require('client-sessions');

// Firebase Admin Client
var firebase = require('./server/database.js');

app.use(jsonParser);
app.use(bodyParser.urlencoded({extended: false}));


// Server Express App
const port = process.env.PORT || 4100;
app.listen(port,);
console.log("Server started on port " + port);