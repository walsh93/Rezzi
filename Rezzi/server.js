const constants = require('./server/constants')

const debug = require('debug')('node-angular');

const http = require('http');
//Express Setup
const express = require('express'),
    app = express();
const path = require('path');


// JSON Request Parser
const bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

//Sessions
const sessions = require('client-sessions');

app.use(sessions({
  cookieName: '__session',  // accessible via `request.__session`
  secret: 'hslawnagemztuyelnocllubnrutyelirnnylnoraanamffohiakhcirugerganiratak',
  duration: 30 * 60 * 1000,  // how long the session will stay valid in ms
  cookie: {
    path: '/', // cookie will only be sent to requests under '/api'
    ephemeral: true, // when true, cookie expires when the browser closes
    httpOnly: false, // when true, cookie is not accessible from javascript
  }
}));

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

// URL and routing setup
const service = require('./server/constants').service
const url = require('./server/constants').url

// Routers for the rezzi.service
const getSession = require('./server/service/getSession')
app.use(service.get_session, getSession)
const getFloors = require('./server/service/getFloors')
app.use(service.get_floors, getFloors)

// Routers, links to URLs
const signup = require('./server/routes/sign-up')
app.use(url.sign_up, signup)
const signuphd = require('./server/routes/sign-up-hd')
app.use(url.sign_up_hd, signuphd)
const signin = require('./server/routes/sign-in')
app.use(url.sign_in, signin)
const home = require('./server/routes/home')
app.use(url.home, home)
const signout = require('./server/routes/sign-out')  // Get the router that's written in ./server/routes/sign-out.js
app.use(url.sign_out, signout)  // Link this router to respond to the link .../sign-out
const inviteusers = require('./server/routes/invite-users')
app.use(url.invite_users, inviteusers)
const getchannels = require('./server/routes/get-channels')
app.use(url.get_channels, getchannels)
const joinchannel = require('./server/routes/join-channel')
app.use(url.join_channel, joinchannel)

// Testing
app.use((request,response,next)=>{
  response.setHeader('Access-Control-Allow-Origin','*');
  response.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept'
  );
  response.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS');
  next();
})

app.post('/api/messages', (request, response, next) => {
  const message = request.body;
  console.log(message);
  response.status(201).json({
    notification: 'Message added successfully'
  });
});

app.use('/api/messages',(request,response,next) => {
  const messages = [
    { id: '123456',
    content: 'First message'},
    { id: '123457',
    content: 'Second message'}
  ];
  response.status(200).json({
    message: 'Messages fetched successfully!',
    messages: messages
  });
});

app.post('/api/sign-up',(request,response,next) => {
  const rb = request.body
  console.log(rb);
  firebase.addUser(rb)
  response.status(201).json({
    notification: 'User may be signed up?'
  });
  //add user here
});

// Error has occured
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Server Express App
const port = process.env.PORT || 4100;
app.set('port',port);
const server = http.createServer(app);
server.on('error',onError);
server.listen(port);
console.log("Server started on port " + port);
