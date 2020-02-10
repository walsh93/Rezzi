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

/**
 * Point static paths to directories containing static assets that need to be served
 * __dirname (/local/path/to/Rezzi/Rezzi)
 * distDir (/local/path/to/Rezzi/Rezzi/dist/Rezzi) for static pages produced by `ng build`
 */
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/dist/Rezzi'));

// Routers for the rezzi.service

// Routers, links to URLs
const signin = require('./server/routes/sign-in')
app.use('/sign-in', signin)
const signout = require('./server/routes/sign-out')  // Get the router that's written in ./server/routes/sign-out.js
app.use('/sign-out', signout)  // Link this router to respond to the link .../sign-out

// Server Express App
const port = process.env.PORT || 4100;
app.listen(port);
console.log("Server started on port " + port);
