// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/**
 * Sources used
 *
 * Firebase Cloud functions

 * https://www.youtube.com/watch?v=YGsmWKMMiYs&list=PL55RiY5tL51r5jyQoPZhwLueLpPeAV6P9&index=2

 */

// Dependencies
const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const os = require('os');
const path = require('path');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const spawn = require('child-process-promise').spawn;
const fs = require('fs');
const admin = require('firebase-admin');
const UUID = require('uuid-v4');

// Storage configuration/initialization for non-storage functions
const storageConfig = {
  projectId: "rezzi-33137",
  keyFilename: "rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json"
};
const storage = new Storage(storageConfig);

// Initialize firebase admin app
const firebaseConfig = __dirname + "/rezzi-33137-firebase-adminsdk-qc1jn-c573685b72.json";
const serviceAccount = require(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rezzi-33137.firebaseio.com"
});
const db = admin.firestore();

// onFileCreated - triggered on successful file generation in Firebase storage
exports.onFileCreated = functions.storage.object().onFinalize((event) => {
  console.log(event);
  return;
});

// onFileDeleted - triggered on successful file deletion in Firebase storage
exports.onFileDeleted = functions.storage.object().onDelete((event) => {
  console.log(event);
  return;
});

// uploadFile - triggered when HTTPS request reaches this endpoint
exports.uploadFile = functions.https.onRequest((request, response) => {
  const docId = request.query.docId;
  console.log(`docID = ${docId}`);

  cors(request, response, () => {
    // if (request.method != "POST") {
    //   return response.status(500).json({
    //     message: "Not allowed!!!",
    //   });
    // }
    const busboy = new Busboy({ headers: request.headers });
    let uploadData = null;

    // Trigger this section when busboy successfully parses a file from incoming request
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = {
        file: filepath,
        type: mimetype,
      };
      console.log("HERE");
      console.log(filename);
      file.pipe(fs.createWriteStream(filepath));
    });

    // Trigger this section when busboy is done parsing the entire request
    busboy.on("finish", () => {
      const bucket = storage.bucket("rezzi-33137.appspot.com");
      return spawn("convert", [uploadData.file, "-resize", "200x200", uploadData.file]).then(() => {
        bucket.upload(uploadData.file, {
          uploadType: "media",
          destination: docId,
          metadata: {
            metadata: {
              contentType: uploadData.type,
              firebaseStorageDownloadTokens: UUID(),
            }
          }
        }).then(() => {
          const file = bucket.file(docId);
          file.exists().then(function (exists) {
            if (exists) {
              file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
              }).then((signedUrls) => {
                const image_url = signedUrls[0];
                db.collection('users').doc(docId).get().then((doc) => {
                  if (doc.exists) {
                    return doc.ref.update({
                      image_url: image_url,
                    }).then((result) => {
                      response.status(200).json({
                        message: "It worked!!!",
                      });
                    });
                  }
                }).catch((error) => {
                  return response.status(500).json({
                    error: error,
                  });
                });
              });
            }
          });
        }).catch((error) => {
          return response.status(500).json({
            error: error,
          });
        });
      });
    });

    // Kick-off the busboy stuff
    busboy.end(request.rawBody);
  });
});

exports.uploadImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const busboy = new Busboy({ headers: request.headers });
    let uploadData = null;
    let extension = '';

    // Trigger this section when busboy successfully parses a file from incoming request
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = {
        file: filepath,
        type: mimetype,
      };
      file.pipe(fs.createWriteStream(filepath));

      let type = mimetype.split('/')[1];
      if (type === 'x-icon') {
        extension = 'ico';
      }
      else if (type === 'svg+xml') {
        extension = '.svg';
      }
      else {
        extension = '.' + type;
      }
    });

    // Trigger this section when busboy is done parsing the entire request
    busboy.on("finish", () => {
      const docId = "uploaded-images/" + UUID() + extension;
      const bucket = storage.bucket("rezzi-33137.appspot.com");
      const download_token = UUID();
      bucket.upload(uploadData.file, {
        uploadType: "media",
        destination: docId,
        metadata: {
          metadata: {
            contentType: uploadData.type,
            firebaseStorageDownloadTokens: download_token,
          }
        }
      }).then(() => {
        const file = bucket.file(docId);
        file.exists().then(function (exists) {
          return response.status(200).json({
            url: 'https://firebasestorage.googleapis.com/v0/b/rezzi-33137.appspot.com/o/' + encodeURIComponent(docId) + '?alt=media&token=' + download_token,
          });
        });
        // storage.refFromURL('gs://rezzi-33137.appspot.com/' + docId).getDownloadURL().then(image_url => {
        //   return response.status(200).json({
        //     url: image_url,
        //   });
        // }).catch((error) => {
        //   return response.status(500).json({
        //     error: error,
        //   });
        // });
      }).catch((error) => {
        return response.status(500).json({
          error: error,
        });
      });
    });

    // Kick-off the busboy stuff
    busboy.end(request.rawBody);
  });
});

// exports.deleteFile = functions.https.onRequest((request, response) => {
//   cors(request, response, () => {
//     if (request.method != "POST") {
//       return response.status(500).json({
//         message: "Not allowed!!!",
//       });
//     }

//     // Request body is the object I declared in home-student.component.ts before calling an HTTP post request
//     const bucket = storage.bucket("rezzi-33137.appspot.com");
//     const file = bucket.file(request.body.filepath);
//     file.delete().then(() => {
//       response.status(200).json({
//         message: "It worked!!!",
//       });
//     });
//   });
// });
