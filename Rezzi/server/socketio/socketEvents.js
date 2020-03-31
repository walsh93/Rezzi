const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket
const createChannelPath = require('../database').createChannelPath
const createUserPath = require('../database').createUserPath


module.exports.newMessage = function newMessage(socket, data) {
  const dbchannel = createChannelPath(data.rezzi, data.channelID)
  if (dbchannel != null) {
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
  let collectionpath = "";
  let docpath = "";
  console.log("Data: ", data);
  if (data.hasOwnProperty("sender")) {
    const paths = createUserPath(data.sender, data.recipient);
    if (paths == null) {
      return;
    }
    collectionpath = paths.senderPath;
    docpath = data.recipient;
  }
  else {
    const dbchannel = createChannelPath(data.rezzi, data.channelID);
    if (dbchannel == null) {
      return;
    }
    collectionpath = dbchannel.channelPath;
    docpath = dbchannel.channelName;
  }
  console.log("Collection: " + collectionpath);
  console.log("Document: " + docpath);

  db.collection(collectionpath).doc(docpath).get().then((doc) => {
    let messages = doc.data().messages;
    let id = parseInt(data.message.id.substring(data.message.id.lastIndexOf('-') + 1));
    let reactions = data.message.reactions;
    let reported = data.message.reported;
    // can add more update possibilites

    if (!messages[id] || messages[id] == null || messages[id] == undefined) {
      return;
    }

    messages[id].reactions = reactions;
    messages[id].reported = reported;

    db.collection(collectionpath).doc(docpath).update({
      messages: messages
    })
    // triggers a socket event in the front end; moved to firestoreListeners.js
    // socket.emit(skt.new_message_added, messages)
  });

  // Have to do other person if its a dm
  if (data.hasOwnProperty("sender")) {
    let collectionpath2 = createUserPath(data.sender, data.recipient).receiverPath;
    let docpath2 = data.sender;
    db.collection(collectionpath2).doc(docpath2).get().then((doc) => {
      let messages = doc.data().messages;
      let id = parseInt(data.message.id.substring(data.message.id.lastIndexOf('-') + 1));
      let reactions = data.message.reactions;
      let reported = data.message.reported;
      // can add more update possibilites

      if (!messages[id] || messages[id] == null || messages[id] == undefined) {
        return;
      }

      messages[id].reactions = reactions;
      messages[id].reported = reported;


      db.collection(collectionpath2).doc(docpath2).update({
        messages: messages
      })
      // triggers a socket event in the front end; moved to firestoreListeners.js
      // socket.emit(skt.new_message_added, messages)
    });
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
    let new_data = JSON.parse(JSON.stringify(data));
    messages = doc.data().messages;
    if(!messages || messages == null || messages == undefined){
      messages = []
    }
    new_data.message.id = new_data.recipient + '-' + messages.length;

    messages.push(new_data.message)
    db.collection(senderPath).doc(new_data.recipient).update({
      messages: messages
    })
  })
  db.collection(receiverPath).doc(data.sender).get().then((doc) => {
    let new_data = JSON.parse(JSON.stringify(data));
    messages = doc.data().messages;
    if(!messages || messages == null || messages == undefined){
      messages = []
    }
    new_data.message.id = new_data.sender + '-' + messages.length;

    messages.push(new_data.message)
    db.collection(receiverPath).doc(new_data.sender).update({
      messages: messages
    })
  })
}
//$$$conley
