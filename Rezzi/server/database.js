// Import HTTP codes
const c = require('./constants')
const db_keys = require('./constants').db_keys

// Get firebase admin library
const admin = require('firebase-admin');

// Initialize firebase admin client
const serviceAccount = require('../rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rezzi-33137.firebaseio.com"
});
const FieldValue = require('firebase-admin').firestore.FieldValue;
//storage stuff
const { Storage } = require('@google-cloud/storage');
const storageConfig = {
  projectId: "rezzi-33137",
  keyFilename: "rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json",
};
const storage = new Storage(storageConfig);
// Get a non-default Storage bucket

console.log('Database client seems to be working');

db = admin.database();

dbstore = admin.firestore();

module.exports = {
  admin: admin,
  db: db
};

// // onFileCreated - triggered on successful file generation in Firebase storage
// module.exports.onFileCreated = functions.storage.object().onFinalize((event) => {
//   console.log(event);
//   return;
// });

// module.exports.uploadFile = functions.https.onRequest((request, response) => {
//   cors(request, response, () => {
//     if (request.method != "POST") {
//       return response.status(500).json({
//         message: "Not allowed!!!",
//       });
//     }

//     // Get the document ID
//     const urlSegments = request.headers["referer"].split("/");
//     const n = urlSegments.length;
//     const docId = urlSegments[n - 1];

//     const busboy = new Busboy({ headers: request.headers });
//     let uploadData = null;

//     // Trigger this section when busboy successfully parses a file from incoming request
//     busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
//       const filepath = path.join(os.tmpdir(), filename);
//       uploadData = {
//         file: filepath,
//         type: mimetype,
//       };
//       file.pipe(fs.createWriteStream(filepath));
//     });

//     // Trigger this section when busboy is done parsing the entire request
//     busboy.on("finish", () => {
//       const bucket = storage.bucket("rezzi-33137.appspot.com");
//       return spawn("convert", [uploadData.file, "-resize", "200x200", uploadData.file]).then(() => {
//         bucket.upload(uploadData.file, {
//           uploadType: "media",
//           destination: docId,
//           metadata: {
//             metadata: {
//               contentType: uploadData.type,
//             }
//           }
//         }).then(() => {
//           const file = bucket.file(docId);
//           file.exists().then(function (exists) {
//             if (exists) {
//               file.getSignedUrl({
//                 action: 'read',
//                 expires: '03-09-2491'
//               }).then((signedUrls) => {
//                 const image_url = signedUrls[0];
//                 db.collection('users').doc(request.__session.email).get().then((doc) => {
//                   if (doc.exists) {
//                     return doc.ref.update({
//                       image_url: image_url,
//                     }).then((result) => {
//                       response.status(200).json({
//                         message: "It worked!!!",
//                       });
//                     }).catch((error) => {
//                       return response.status(500).json({
//                         error: error,
//                       });
//                     });
//                   }

//                 });
//               });
//             }
//           });

//         });



//         // Kick-off the busboy stuff
//         busboy.end(request.rawBody);



        module.exports.addUser = function addUser(data) {
          return new Promise(function (resolve, reject) {
            dbstore.collection('users').doc(data.email).get().then(doc => {
              if (doc.exists && doc.data().verified == true) {
                //Do something about the error here
                //checks to see if account is verified per Megan's implementation
                resolve(501)
              } else if (doc.exists) {
                dbstore.collection('users').doc(data.email).update(data)
                resolve(201)
              } else {
                //Should NEVER get here. Only for SignUpHD
                dbstore.collection('users').doc(data.email).set(data)
                console.log("Potential error when creating account (unless during sign-up-hd)")
                resolve(201)
              }
            }).catch(err => {
              reject(err)
              console.log(err)
              console.log("Error creating account");
            })
          })
        }

        module.exports.editUser = function editUser(data, email) {
          dbstore.collection('users').doc(email).get().then(doc => {
            if (!doc.exists) {
              //Do something about the error here
            } else {
              dbstore.collection('users').doc(email).update(data)
            }
          }).catch(err => {
            //reject(err)
            console.log(err)
            console.log("Error editing account");
          })
        }
        module.exports.requestAccountDeletion = function requestAccountDeletion(data, email) {
          dbstore.collection('users').doc(email).get().then(doc => {
            if (!doc.exists) {
              //Do something about the error here
            } else {
              dbstore.collection('users').doc(email).update(data)
            }
          }).catch(err => {
            //reject(err)
            console.log(err)
            console.log("Error updating deletion status on account");
          })
        }
        module.exports.updateHDArray = function updateHDArray(data, email, user) {
          console.log("qwwqdwqdw " + email + " " + user)
          dbstore.collection('users').doc(email).get().then(doc => {
            if (!doc.exists) {
              //Do something about the error here
            } else {
              dbstore.collection('users').doc(email).update({ 'deletionRequests': FieldValue.arrayUnion(user) })
            }
          }).catch(err => {
            //reject(err)
            console.log(err)
            console.log("Error updating HD's deletion requests");
          })
        }

        module.exports.createChannelPath = function createChannelPath(rezzi, channelID) {
          if (channelID != null) {
            const resHallPath = `${db_keys.rezzis}/${rezzi}`
            let channelPath = null
            let channelName = null
            const level = channelID.split('-')[0]
            if (level === 'floors') {
              // does NOT consider whether floor name has a '-', but DOES consider if channel name has a '-'
              const firstDash = channelID.indexOf('-')
              const secondDash = channelID.indexOf('-', firstDash + 1)
              const floorName = channelID.slice(firstDash + 1, secondDash)
              channelName = channelID.slice(secondDash + 1)
              channelPath = `${resHallPath}/floors/${floorName}/channels`
            } else {  // either 'hallwide' or 'RA'
              const dash = channelID.indexOf('-')
              const hwOrRa = channelID.slice(0, dash)
              channelName = channelID.slice(dash + 1)
              channelPath = `${resHallPath}/${hwOrRa}`
            }

            if (channelPath == null || channelName == null) {
              return null
            }

            return { channelPath, channelName }
          }

          return null
        }

        //$$$conley
        module.exports.createUserPath = function createUserPath(sender, receiver) {
          if (sender == null || receiver == null) {
            console.log("Path Creating Error");
            return null;
          }
          senderPath = `users/${sender}/private-messages`;
          receiverPath = `users/${receiver}/private-messages`;
          return { senderPath: senderPath, receiverPath: receiverPath };
        }

