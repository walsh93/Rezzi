const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket

module.exports.addListenerForChannelMessages = function alfcm(io, data) {
  // console.log('addListenerForChannelMessages',data)
  return db.collection(data.channelPath).where('title', '==', data.channelName).onSnapshot((snap) => {
    snap.docChanges().forEach((change) => {
      if (serverCurrentChannel == `${data.channelPath}/${data.channelName}`) {
        if (change.type === 'added' || change.type === 'modified') {
          io.emit(skt.new_message_added, change.doc.data().messages)  // triggers a socket event in the front end
        }
        if (change.type === 'removed') {
          console.log('Removed channel: ', change.doc.data());
        }
      }
    })
  })

  // returns an observer
}

//TODO add listener here

module.exports.addListenerForPrivateMessages = function alfpm(io, data) {
  return db.collection(data.userPath).where('title', '==', data.receiverID).onSnapshot((snap) => {
    snap.docChanges().forEach((change) => {
      if (serverCurrentPrivate == `${data.userPath}/${data.receiverID}`) {
        console.log(change.type)
        if (change.type === 'added' || change.type === 'modified') {
          io.emit(skt.new_private_message_added, change.doc.data().messages)  // triggers a socket event in the front end
        }
        if (change.type === 'removed') {
          console.log('Removed private message: ', change.doc.data());
        }
      }
    })
  })

  // returns an observer
}
