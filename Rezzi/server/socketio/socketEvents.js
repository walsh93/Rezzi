const admin = require('firebase-admin')
const db = admin.firestore()
const skt = require('../constants').socket
const createChannelPath = require('../database').createChannelPath
const createUserPath = require('../database').createUserPath
const keys = require('../constants').db_keys

// necessary for multimedia
const got = require('got')
const escapeHtml = require('escape-html')
const linkify = require('linkifyjs')
const linkifyHtml = require('linkifyjs/html')
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

      if (data.message.id == 'BOT_MSG') {
        messages.push(data.message);
        db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
          messages: messages
        })
      } else {
        data.message.id = data.channelID + '-' + messages.length;
        if (data.message.event !== null) {
          let events = doc.data().calendar;
          data.message.event.id = data.channelID + '-' + events.length;

          // The creator automatically goes to the event
          db.collection(keys.users).doc(data.message.owner.email).update({
            calendar: [data.message.event.id]
          });

          // certain data only needs to go in global calendar, not in user calendar
          let event = JSON.parse(JSON.stringify(data.message.event));
          event.attending = {
            going: [event.owner],
            interested: [],
            'not going': []
          };
          events.push(event);

          messages.push(data.message);
          db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
            calendar: events,
            messages: messages
          });
        }
        else {
          processMessageContent(data).then(response => {
            messages.push(response.message);
            db.collection(dbchannel.channelPath).doc(dbchannel.channelName).update({
              messages: messages
            })
          })
        }
      }
      // triggers a socket event in the front end; moved to firestoreListeners.js
      // socket.emit(skt.new_message_added, messages)
    })
  }
}

module.exports.updateMessage = function updateMessage(socket, data) {
  let collectionpath = "";
  let docpath = "";
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
    messages[id].visible = data.message.visible;
    if(data.message.isPoll){
      messages[id].pollInfo = data.message.pollInfo;
    }
    console.log('Updated Message: ', messages[id]);
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
  console.log("newPrivateMessage() in socketEvents.js");
  const paths = createUserPath(data.sender, data.recipient);
  const senderPath = paths.senderPath;
  const receiverPath = paths.receiverPath;
  if(senderPath == null || receiverPath == null){
    console.log("newPrivateMessage error - socketEvents.js");
    return null;
  }
  processMessageContent(data).then(data => {
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
      });
    });
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
      });
    });
  });
}
//$$$conley

// Checks if the given url points to an image
// from https://stackoverflow.com/questions/19395458/check-if-a-link-is-an-image
function isUriImage(uri_obj) {
  let uri = uri_obj.href;
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
        console.log("RESULTS:", results);
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
        resolve_html += '<p style="margin: 5px 5px 5px 10px">' + (results.description === null ? 'No description available' : results.description) + '</p></div>';
        resolve(resolve_html);
      });
    });
  });
}

function processMessageContent(data) {
  return new Promise((resolve, reject) => {
    let links = linkify.find(data.message.content);

    // initialize image if applicable
    if (links.length > 0) {
      // filter the links down
      let pic_links = links.filter(isUriImage);
      let youtube_links = links.filter(link => getVideoId(link.href));
      let normal_links = links.filter(link => !(isUriImage(link) || getVideoId(link.href)));
      console.log("Pic links:", pic_links);
      console.log("Youtube links:", youtube_links);
      console.log("Normal links:", normal_links);

      if (pic_links.length > 0 && data.message.image === null) {  // only display the last image
        data.message.image = pic_links[pic_links.length - 1].href;
        if (data.message.content.replace(pic_links[0].value, "") === "") {
          data.message.content = null;
        }
      }

      if (youtube_links.length > 0) {  // only use last youtube video
        let video_id = getVideoId(youtube_links[youtube_links.length - 1].href);
        // data.message.image = "https://img.youtube.com/vi/" + video_id + "/maxresdefault.jpg";
        data.message.content = linkifyHtml('<p>' + escapeHtml(data.message.content) + '</p>') + "=====================" +
          '<div style="position: relative; width=100%; height: 0; padding-bottom: 56.45%">' +
          '<iframe ' +
              'style="position: absolute; top: 0; bottom: 0; width: 100%; height: 100%;" ' +
              'width="420" height="315" allowfullscreen frameborder="0" ' +
              'src="https://www.youtube.com/embed/' + video_id + '">' +
          '</iframe></div>';
        resolve(data);
        return;
      }

      if (normal_links.length > 0) {
        // must get OpenGraph data
        getOGData(normal_links[normal_links.length - 1].href).then(resolved => {
          data.message.content = linkifyHtml('<p>' + escapeHtml(data.message.content) + '</p>') + "=====================" + resolved;
          resolve(data);
        }).catch(reject => {
          console.log(reject);
          data.message.content = linkifyHtml('<p>' + escapeHtml(data.message.content) + '</p>');
          resolve(data);
        });
      }
      else {
        if (data.message.content !== null) {
          data.message.content = linkifyHtml('<p>' + escapeHtml(data.message.content) + '</p>');
        }
        resolve(data);
      }
    }
    else {
      data.message.content = linkifyHtml('<p>' + escapeHtml(data.message.content) + '</p>');
      resolve(data);
    }
  });
}
