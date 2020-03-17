const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket

module.exports.addListenerForChannelMessages = function alfcm(socket, data) {
  console.log('addListenerForChannelMessages')
  return db.collection(data.channelPath).where('title', '==', data.channelName).onSnapshot((snap) => {
    snap.docChanges().forEach((change) => {
      if (serverCurrentChannel == `${data.channelPath}/${data.channelName}`) {
        console.log(change.type)
        if (change.type === 'added' || change.type === 'modified') {
          socket.emit(skt.new_message_added, change.doc.data().messages)  // triggers a socket event in the front end
        }
        if (change.type === 'removed') {
          console.log('Removed channel: ', change.doc.data());
        }
      }
    })
  })

  // returns an observer
}

module.exports.addListenerForPrivateMessages = function alfpm(socket, data) {
  console.log('addListenerForPrivateMessages')
  return db.collection(data.userPath).where('title', '==', data.receiverID).onSnapshot((snap) => {
    snap.docChanges().forEach((change) => {
      if (serverCurrentChannel == `${data.userPath}/${data.receiverID}`) {
        console.log(change.type)
        if (change.type === 'added' || change.type === 'modified') {
          socket.emit(skt.new_message_added, change.doc.data().messages)  // triggers a socket event in the front end
        }
        if (change.type === 'removed') {
          console.log('Removed channel: ', change.doc.data());
        }
      }
    })
  })

  // returns an observer
}
