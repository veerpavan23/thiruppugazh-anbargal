// config.js - Firebase Initialization

const firebaseConfig = {
  apiKey: "AIzaSyBZj1DcjriYkzGsu6su5mgVdzFD0yC4-r8",
  authDomain: "thiruppugazhanbargal-515e8.firebaseapp.com",
  databaseURL: "https://thiruppugazhanbargal-515e8.firebaseio.com",
  projectId: "thiruppugazhanbargal-515e8",
  storageBucket: "thiruppugazhanbargal-515e8.appspot.com",
  messagingSenderId: "480701966077",
  appId: "1:480701966077:web:35118115fd6e0237",
  measurementId: "G-NDZQTKDGKE"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

window.db = db;
window.auth = auth;
