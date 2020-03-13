const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket
const createChannelPath = require('../database').createChannelPath

module.exports.newMessage = function newMessage(socket, data) {
  const dbchannel = createChannelPath(data.rezzi, data.channelID)
  if (dbchannel != null) {
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let messages = doc.data().messages
      if (!messages || messages == null || messages == undefined) {
        messages = []
      }
      messages.push(data.message)
      db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
        messages: messages
      })
      // triggers a socket event in the front end; moved to firestoreListeners.js
      // socket.emit(skt.new_message_added, messages)
    })
  }
}
