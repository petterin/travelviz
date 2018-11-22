import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const CONFIG = {
  apiKey: "AIzaSyA6yV8yMe0xARz9V0MP291mJcT6MuA3fjI",
  authDomain: "tourdeteemu.firebaseapp.com",
  databaseURL: "https://tourdeteemu.firebaseio.com",
  projectId: "tourdeteemu"
};

class Firebase {
  constructor() {
    firebase.initializeApp(CONFIG);

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    // Disable deprecated Firebase features
    this.db.settings({ timestampsInSnapshots: true });
  }

  // --- Internal Auth API ---

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // --- Auth User API --- //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log("User logged in.");
        // TODO: Combine user data from Auth and DB?
        next(authUser);
      } else {
        console.log("User is logged out.");
        fallback();
      }
    });
}

export default Firebase;

export const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
