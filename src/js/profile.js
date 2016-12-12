/*
Author: Calivn Korver, Kyle McNulty, Patrick Yi
This is the main profile page for the user.
The actual feed rendering is handled by mutual.js

*/

/* Handles firebase authentication etc. */
var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
var personalRef = firebase.database().ref("personal");
var bioRef = firebase.database().ref("bio");

var videoList = document.querySelector(".video-list");
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        loadPage(currentUser);
        console.log(currentUser);
    } else {
        firebase.auth().signInWithRedirect(authProvider);
        window.location = "index.html";
    }
});


document.getElementById("sign-out-button").addEventListener("click", function () {
    firebase.auth().signOut();
});

/* Loads the page of the user and their videos */
function loadPage(user) {
    var info = document.getElementById("info");

    var gravatarPhoto = document.createElement("img");
    gravatarPhoto.classList += " userPhoto";
    gravatarPhoto.src = currentUser.photoURL;
    info.appendChild(gravatarPhoto);

    var name = document.createElement("h1");
    name.classList += " userName";
    name.textContent = user.displayName;
    info.appendChild(name);
    bioRef.on("value", renderBio);
    currentUser = user;
    personalRef.limitToLast(20).on("value", render);
}

/* Renders each snapshot in the storage by calling the renderMovie method for each snapshot that we get */
function render(snapshot) {
    videoList.innerHTML = "";
    snapshot.forEach(function(video) {
        if(video.val().createdBy.uid === currentUser.uid) {
            renderMovie(video);
        }
    });
}

/* Renders the bio of the user */
function renderBio(snapshot) {
    snapshot.forEach(renderEachBio);
}

/* Renders the bio if we found one that matches the user */
function renderEachBio(snapshot) {
    if (snapshot.val()) {
        var current = snapshot.val();
        if (current.email === currentUser.email) {
            var bio = document.createElement("p");
            bio.classList += " bio";
            bio.textContent = current.bio;
            document.getElementById('info').appendChild(bio);
        }
    }
};







