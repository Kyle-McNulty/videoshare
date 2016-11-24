/*
Calvin Korver
Info 343
Services Challenge
11-2-16
*/

var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
    //if there is an authenticated user...
    if (user) {
        currentUser = user;
    } else {
        firebase.auth().signInWithRedirect(authProvider);
        window.location = "index.html";
    }
});

document.getElementById("sign-out-button").addEventListener("click", function (){
    firebase.auth().signOut();
});

// var messageForm = document.querySelector(".new-message-form");
// var messageTitleInput = messageForm.querySelector(".new-message-title");
// var messageList = document.querySelector(".task-list");

var generalRef = firebase.database().ref("general");
