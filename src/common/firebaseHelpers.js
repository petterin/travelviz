import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  // apiKey: "",
  authDomain: "tourdeteemu.firebaseapp.com",
  databaseURL: "https://tourdeteemu.firebaseio.com",
  projectId: "tourdeteemu"
};

export function initFirebase() {
  firebase.initializeApp(config);
  return firebase;
}

export function initFirestore(firebase) {
  const db = firebase.firestore();
  // Disable deprecated Firebase features
  db.settings({ timestampsInSnapshots: true });
  return db;
}
