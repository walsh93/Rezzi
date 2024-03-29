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
const getHD = require('./server/service/getHD')
app.use(service.get_hd, getHD)
const getProfile = require('./server/service/getProfile')
app.use(service.get_profile, getProfile)
const updateAccountType = require('./server/service/updateAccountType')
app.use(service.update_account_type, updateAccountType)
const updateHDArray = require('./server/service/updateHDArray')
app.use(service.update_hd, updateHDArray)
const updateHDArrayRPT = require('./server/service/updateHDArrayRPT')
app.use(service.update_hd_rpt, updateHDArrayRPT)
const channelMessages = require('./server/service/channelMessages')
app.use(service.channel_messages, channelMessages)
const getRAs = require('./server/service/getRAs')
app.use(service.getRAs, getRAs)
const getResidents = require('./server/service/getResidents')
app.use(service.getResidents, getResidents)
const privateMessages = require('./server/service/privateMessages')
app.use(service.private_messages, privateMessages)
const raFromFloor = require('./server/service/getRaFromFloor')
app.use(service.get_floor_ra, raFromFloor)
const getChannelRequests = require('./server/service/getChannelRequests')
app.use(service.get_channel_requests, getChannelRequests)
const getChannelData = require('./server/service/getChannelData')
app.use(service.get_channel_data, getChannelData)
const getReportedMessages = require('./server/service/getReportedMessages')
app.use(service.get_reported_messages, getReportedMessages)
const getMessage = require('./server/service/getMessage')
app.use(service.get_message, getMessage)
const getDeletionRequests = require('./server/service/getDeletionRequests')
app.use(service.get_deletion_requests, getDeletionRequests)
const deleteReportedMessage = require('./server/service/deleteReportedMessage')
app.use(service.delete_reported_message, deleteReportedMessage)
const getResByFloor = require('./server/service/getResidentsByFloor')
app.use(service.get_res_by_floor, getResByFloor)
const getResByChannel = require('./server/service/getResidentsByChannel')
app.use(service.get_res_by_channel, getResByChannel)
const getResByChannelNonAdmin = require('./server/service/getResidentsByChannelNonAdmin')
app.use(service.get_res_by_channel_non_admin, getResByChannelNonAdmin)
const updateCanPost = require('./server/service/updateCanPost')
app.use(service.update_canpost, updateCanPost)
const updateIsMuted = require('./server/service/updateIsMuted')
app.use(service.update_ismuted, updateIsMuted)
const getNotifications = require('./server/service/getNotifications')
app.use(service.getNotifications, getNotifications)

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
const usermanagement = require('./server/routes/user-management')
app.use(url.user_management, usermanagement)
const hdnotifications = require('./server/routes/hd-notifications')
app.use(url.hd_notifications, hdnotifications)
const deleteUser = require('./server/routes/deleteUser')
app.use(url.deleteUser, deleteUser)
const moveUser = require('./server/routes/move-user')
app.use(url.move_user, moveUser)
const resendEmail = require('./server/routes/resend-email')
app.use(url.resend_email, resendEmail)
const dismissNotification = require('./server/routes/dismiss-notification')
app.use(url.dismiss_notification, dismissNotification)
const muteNotifications = require('./server/routes/mute-notifications')
app.use(url.mute_notifications, muteNotifications)

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
const leavechannel = require('./server/routes/leave-channel')
app.use(url.leave_channel, leavechannel)
const deletechannel = require('./server/routes/delete-channel')
app.use(url.delete_channel, deletechannel)
const createrezzi = require('./server/routes/create-rezzi')
app.use(url.create_rezzi, createrezzi)
const dashboard = require('./server/routes/dashboard')
app.use(url.dashboard, dashboard)
const requestchannel = require('./server/routes/request-channel')
app.use(url.request_channel, requestchannel)
const channelrequests = require('./server/routes/channel-requests')  // RA responding to request
app.use(url.channel_requests, channelrequests)

const get_pm_users = require('./server/routes/get-pm-users')
app.use(url.get_pm_users, get_pm_users)
const get_non_pm_users = require('./server/routes/get-non-pm-users')
app.use(url.get_non_pm_users, get_non_pm_users)
const create_pm = require('./server/routes/create-pm')
app.use(url.create_pm, create_pm);

const respond_to_event = require('./server/routes/respond-event')
app.use(url.respond_to_event, respond_to_event)
const get_events = require('./server/routes/get-events')
app.use(url.get_events, get_events)
const cancel_event = require('./server/routes/cancel-event')
app.use(url.cancel_event, cancel_event)

const send_notifications = require('./server/routes/send-notifications')
app.use(url.send_notifications, send_notifications)

const setup_test = require('./server/routes/setup-test')
app.use(url.setup_test, setup_test)

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
  firebase.addUser(rb)
  response.status(201).json({
    notification: 'User may be signed up?'
  });
  //add user here
})






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
serverPrivateListeners = new Map()
serverCurrentChannel = null
serverCurrentPrivate = null

// IO listener
io.on(skt.connection, (socket) => {
  console.log('client connected to socket with ID ' + socket.client.id)

  // When a new message is sent
  socket.on(skt.new_message, (data) => {  // responds to a socket event sent from the front end
    socketEvents.newMessage(socket, data)
  });

  /**
   * When the user begins viewing a different channel
   * Need to pass `io` to addListenerForChannelMessages() instead of `socket`
   * There is one IO listener in the server, but many different sockets can connect to it (new socket connections
   * made on reroute, reload, refresh, etc.)
   * If `socket` is passed (and this that `socket` calls emit), if a new connection is made, this old socket can't
   * reach the new connection, so the frontend will not respond even though the backend is emitting data
   */
  socket.on(skt.new_channel_view, (dbpath) => {
    serverCurrentChannel = `${dbpath.channelPath}/${dbpath.channelName}`
    if (!serverChannelListeners.has(serverCurrentChannel)) {
      const observer = dbListeners.addListenerForChannelMessages(io, dbpath)
      serverChannelListeners.set(serverCurrentChannel, observer)
    }
  });

  // When a message is updated (like reactions)
  socket.on(skt.update_message, (data) => {
    socketEvents.updateMessage(socket, data)
  });

  /**
   * When the user begins viewing a different private message channel
   * Need to pass `io` to addListenerForChannelMessages() instead of `socket`
   * There is one IO listener in the server, but many different sockets can connect to it (new socket connections
   * made on reroute, reload, refresh, etc.)
   * If `socket` is passed (and this that `socket` calls emit), if a new connection is made, this old socket can't
   * reach the new connection, so the frontend will not respond even though the backend is emitting data
   */
  socket.on(skt.new_private_view, (dbpath) => {
    serverCurrentPrivate = `${dbpath.userPath}/${dbpath.receiverID}`
    console.log("server.js",serverCurrentPrivate, dbpath)
    if (!serverPrivateListeners.has(serverCurrentPrivate)) {
      const observer = dbListeners.addListenerForPrivateMessages(io, dbpath)
      serverPrivateListeners.set(serverCurrentPrivate, observer)
    }
  });

  //$$$conley
  socket.on(skt.new_private_messsage, (data) => {
    console.log("Server.js - socket.on")
    socketEvents.newPrivateMessage(socket, data)
  });
});

// Server listener
server.on('error',onError);
server.listen(port);
console.log("Server started on port " + port);
