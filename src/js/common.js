//this file is included in all pages, so use this for anything
//that is common across all your pages, or functions that are
//shared between more than one page
"use strict";

//put your Firebase initialization here so that every page
//can call the Firebase API
//firebase.initializeApp(...);
var config = {
    apiKey: "AIzaSyAC6Zuw0pTBsR7qiBDIQxEsu9D1qNCtc8I",
    authDomain: "videoshare-a2211.firebaseapp.com",
    databaseURL: "https://videoshare-a2211.firebaseio.com",
    storageBucket: "videoshare-a2211.appspot.com",
    messagingSenderId: "935577643404"
  };
firebase.initializeApp(config);