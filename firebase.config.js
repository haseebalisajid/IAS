
var admin = require("firebase-admin");

var serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:process.env.databaseURL,
});

// Initialize Firebase
const database=admin.database().ref('/notifications');

module.exports = database;