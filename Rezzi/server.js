const constants = require('./server/constants')
const db_keys = constants.db_keys;
const indexFile = constants.indexFile

const debug = require('debug')('node-angular');

const http = require('http');
const msgsocketio = require('socket.io')

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
const admin = require('firebase-admin')
const db = admin.firestore()

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
const getUser = require('./server/service/getUser')
app.use(service.get_user, getUser)
const channelMessages = require('./server/service/channelMessages')
app.use(service.channel_messages, channelMessages)

// Routers, links to URLs
const welcome = require('./server/routes/welcome')
app.use('/welcome', welcome)
const signup = require('./server/routes/sign-up')
app.use(url.sign_up, signup)
const signuphd = require('./server/routes/sign-up-hd')
app.use(url.sign_up_hd, signuphd)
const signin = require('./server/routes/sign-in')
app.use(url.sign_in, signin)
const home = require('./server/routes/home')
app.use(url.home, home)
const editprofile = require('./server/routes/edit-profile')
app.use(url.edit_profile,editprofile)
const createchannel = require('./server/routes/create-channel')
app.use(url.create_channel, createchannel)
const signout = require('./server/routes/sign-out')  // Get the router that's written in ./server/routes/sign-out.js
app.use(url.sign_out, signout)  // Link this router to respond to the link .../sign-out
const inviteusers = require('./server/routes/invite-users')
app.use(url.invite_users, inviteusers)

const pwordResetRequest = require('./server/routes/pwordResetRequest')
app.use(url.pword_reset_request, pwordResetRequest)
const pwordResetSent = require('./server/routes/pwordResetSent')
app.use(url.pword_reset_sent, pwordResetSent)
const pwordResetChange = require('./server/routes/pwordResetChange')
app.use(url.pword_reset_change, pwordResetChange)

const getchannels = require('./server/routes/get-channels')
app.use(url.get_channels, getchannels)
const joinchannel = require('./server/routes/join-channel')
app.use(url.join_channel, joinchannel)
const createrezzi = require('./server/routes/create-rezzi')
app.use(url.create_rezzi, createrezzi)
const dashboard = require('./server/routes/dashboard')
app.use(url.dashboard, dashboard)


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
  // response.status(201).json({
  //   notification: 'Message added successfully'
  // });
  response.status(200)//.sendFile(indexFile)
});

app.use('/api/messages',(request,response,next) => {
  const messages = [
    { id: '123456',
    content: 'First message'},
    { id: '123457',
    content: 'Second message'}
  ];
  // response.status(200).json({
  //   message: 'Messages fetched successfully!',
  //   messages: messages
  // });
  response.status(200)//.sendFile(indexFile)
});

app.post('/api/sign-up',(request,response,next) => {
  const rb = request.body
  console.log(rb);
  firebase.addUser(rb)
  response.status(201).json({
    notification: 'User may be signed up?'
  });
  //add user here
})

// app.post('api/edit-profile', (request, response, next) => {
//   const rb = request.body;
//   console.log(rb);
//   firebase.getUser();
// })




// All routes fall to here if they didn't match any of the previous routes
app.get('*', function (request, response) {
  response.sendFile(indexFile)
})

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

// Port instantiation
const port = process.env.PORT || 4100;
app.set('port',port);

// Create server and SocketIO
const server = http.createServer(app);
const io = msgsocketio(server)
const socketEvents = require('./server/socketio/socketEvents')
const dbListeners = require('./server/socketio/firestoreListeners')
const skt = require('./server/constants').socket

// Map of db channel listeners
serverChannelListeners = new Map()
serverCurrentChannel = null

// IO listener
io.on(skt.connection, (socket) => {
  console.log('client connected to socket with ID ' + socket.client.id)

  // When a new message is sent
  socket.on(skt.new_message, (data) => {  // responds to a socket event sent from the front end
    socketEvents.newMessage(socket, data)
  });

  // When the user begins viewing a different channel
  socket.on(skt.new_channel_view, (dbpath) => {
    serverCurrentChannel = `${dbpath.channelPath}/${dbpath.channelName}`
    if (!serverChannelListeners.has(serverCurrentChannel)) {
      const observer = dbListeners.addListenerForChannelMessages(socket, dbpath)
      serverChannelListeners.set(serverCurrentChannel, observer)
    }
  });
  //$$$conley
  socket.on(skt.new_private_messsage, (data) => {
    socketEvents.newPrivateMessage(socket, data)
  });


})

// Server listener
server.on('error',onError);
server.listen(port);
console.log("Server started on port " + port);
