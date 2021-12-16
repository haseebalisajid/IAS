
var admin = require("firebase-admin");

var serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:process.env.databaseURL,
});

// Initialize Firebase
const userRef=admin.database().ref('/userNotifications');
const companyRef=admin.database().ref('/companyNotifications');
const adminRef=admin.database().ref('/adminNotifications');

module.exports = {userRef,companyRef,adminRef};