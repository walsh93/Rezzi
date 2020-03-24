const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket
const createChannelPath = require('../database').createChannelPath
const createUserPath = require('../database').createUserPath


module.exports.newMessage = function newMessage(socket, data) {
  const dbchannel = createChannelPath(data.rezzi, data.channelID)
  if (dbchannel != null) {
    // Get number of messages for id setting
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let messages = doc.data().messages
      if (!messages || messages == null || messages == undefined) {
        messages = []
      }
      data.message.id = data.channelID + '-' + messages.length;
      messages.push(data.message);
      db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
        messages: messages
      })
      // triggers a socket event in the front end; moved to firestoreListeners.js
      // socket.emit(skt.new_message_added, messages)
    })
  }
}

module.exports.updateMessage = function updateMessage(socket, data) {
  const dbchannel = createChannelPath(data.rezzi, data.channelID);
  console.log("Updating message " + data.message.id + " to", data.message)
  if (dbchannel != null) {
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let messages = doc.data().messages;
      let id = parseInt(data.message.id.split('-')[-1]);
      let reactions = data.message.reactions;
      // can add more update possibilites

      if (!messages[id] || messages[id] == null || messages[id] == undefined) {
        return;
      }

      messages[id].reactions = reactions;

      db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
        messages: messages
      })
      // triggers a socket event in the front end; moved to firestoreListeners.js
      // socket.emit(skt.new_message_added, messages)
    })
  }
}

//$$$conley
module.exports.newPrivateMessage = function newPrivateMessage(socket, data) {
  console.log("In socketEvents.js");
  const paths = createUserPath(data.sender, data.recipient);
  const senderPath = paths.senderPath;
  const receiverPath = paths.receiverPath;
  if(senderPath == null || receiverPath == null){
    console.log("newPrivateMessage error - socketEvents.js");
    return null;
  }
  db.collection(senderPath).doc(data.recipient).get().then((doc) => {
    messages = doc.data().messages;
    if(!messages || messages == null || messages == undefined){
      messages = []
    }
    messages.push(data.message)
    db.collection(senderPath).doc(data.recipient).update({
      messages: messages
    })
  })
  db.collection(receiverPath).doc(data.sender).get().then((doc) => {
    messages = doc.data().messages;
    if(!messages || messages == null || messages == undefined){
      messages = []
    }
    messages.push(data.message)
    db.collection(receiverPath).doc(data.sender).update({
      messages: messages
    })
  })
}
//$$$conley
