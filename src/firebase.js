import firebase from "firebase";

var config = {
  apiKey: "AIzaSyA_ynn1EbrJ_yGUHK4rvEHzbmN2GBMISFY",
  authDomain: "predictions-3205d.firebaseapp.com",
  databaseURL: "https://predictions-3205d.firebaseio.com",
  storageBucket: "predictions-3205d.appspot.com",
  messagingSenderId: "178320893866"
};


const firebaseApp = firebase.initializeApp(config);
export const firebaseAuth = firebaseApp.auth()
export const database = firebaseApp.database();
export const providerGithub = new firebase.auth.GithubAuthProvider();
export const providerGoogle = new firebase.auth.GoogleAuthProvider();