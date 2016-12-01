//this file is included in all pages, so use this for anything
//that is common across all your pages, or functions that are
//shared between more than one page
"use strict";

//put your Firebase initialization here so that every page
//can call the Firebase API
//firebase.initializeApp(...);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA_ifODWpquF1yiGtXvf-v6lVWSr0Wg2QI",
    authDomain: "slackswag-df4c2.firebaseapp.com",
    databaseURL: "https://slackswag-df4c2.firebaseio.com",
    storageBucket: "slackswag-df4c2.appspot.com",
    messagingSenderId: "922168209347"
};
firebase.initializeApp(config);
