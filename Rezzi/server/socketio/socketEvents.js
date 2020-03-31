const admin = require('firebase-admin')
const getUrls = require('get-urls')
const db = admin.firestore()
const skt = require('../constants').socket
const createChannelPath = require('../database').createChannelPath
const createUserPath = require('../database').createUserPath

const got = require('got')
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo'),
  require('metascraper-title')(),
  require('metascraper-url')(),
])

module.exports.newMessage = function newMessage(socket, data) {
  const dbchannel = createChannelPath(data.rezzi, data.channelID)
  if (dbchannel != null) {
    db.collection(dbchannel.channelPath).doc(dbchannel.channelName).get().then((doc) => {
      let messages = doc.data().messages
      if (!messages || messages == null || messages == undefined) {
        messages = []
      }
      data.message.id = data.channelID + '-' + messages.length;
      data.message.content = '<p>' + data.message.content + '</p>';

      // initialize image if applicable
      let links = getUrls(data.message.content, {requireSchemeOrWww: false})
      if (links.size > 0) {
        let link = Array.from(links).pop();
        let added = false;
        if (isUriImage(link)) {
          data.message.image = link;
          added = true;
        }
        else if (link.includes("youtube") || link.includes("youtu.be")) {
          let video_id = getVideoId(link);
          if (video_id !== false) {
            data.message.image = "https://img.youtube.com/vi/" + video_id + "/maxresdefault.jpg";
          }
          else {
            added = false;
          }
        }
        if (!added) {
          // must get OpenGraph data
          getOGData(link).then(resolve => {
            data.message.content = data.message.content + "=====================" + resolve;
            messages.push(data.message);
            db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
              messages: messages
            })
          }).catch(reject => {
            console.log(reject);
            messages.push(data.message);
            db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
              messages: messages
            })
          });
        }
        else {
          messages.push(data.message);
          db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
            messages: messages
          })
        }
      }
      else {
        messages.push(data.message);
        db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
          messages: messages
        })
      }
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
    // can add more update possibilites

    if (!messages[id] || messages[id] == null || messages[id] == undefined) {
      return;
    }

    messages[id].reactions = reactions;

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
      // can add more update possibilites

      if (!messages[id] || messages[id] == null || messages[id] == undefined) {
        return;
      }

      messages[id].reactions = reactions;

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

// Checks if the given url points to an image
// from https://stackoverflow.com/questions/19395458/check-if-a-link-is-an-image
function isUriImage(uri) { 
  //make sure we remove any nasty GET params 
  uri = uri.split('?')[0];
  //moving on, split the uri into parts that had dots before them
  var parts = uri.split('.');
  //get the last part ( should be the extension )
  var extension = parts[parts.length-1];
  //define some image types to test against
  var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
  //check if the extension matches anything in the list.
  if(imageTypes.indexOf(extension) !== -1) {
      return true;   
  }
}

// Gets youtube video id
function getVideoId(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

// Gets the the data for a url and returns html
function getOGData(link) {
  return new Promise((resolve, reject) => {
    got(link).then((response) => {
      metascraper({ html: response.body, url: response.url }).then(results => {
        let image = (results.image !== null ? results.image : results.logo);
        let resolve_html = '<a href="' + results.url + '">' +
            '<strong>' + results.title + '</strong>' +
          '</a>' + 
          '<div style="display: flex; justify-content: flex-start;">';
        if (image !== null && image !== undefined && image !== "") {
          resolve_html += '<img src="' + image + '" ' +
              'style="flex: none" ' +
              'width="65px" ' +
              'height="65px">';
        }
        resolve_html += '<p style="margin: 5px 5px 5px 10px">' + results.description + '</p></div>';
        resolve(resolve_html);
      });
    });
  });
}