

/* Handles firebase authentication etc. */
var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
    //if there is an authenticated user...
    if (user) {
        currentUser = user;
        loadPage(currentUser);
    } else {
        firebase.auth().signInWithRedirect(authProvider);
        window.location = "index.html";
    }
});
//console.log(currentUser);
document.getElementById("sign-out-button").addEventListener("click", function (){
    firebase.auth().signOut();
});




/* Changes the page to profile page from button input in nav bar */
document.getElementById("feed-page-button").addEventListener("click", function (){
  console.log("Changing page");
  window.location = "../videos.html";
});

var page = document.getElementById("page-content");

function loadPage(user) {
    console.log(user);

    var info = document.createElement("span");

    var gravatarPhoto = document.createElement("img");
    gravatarPhoto.classList += " userPhoto";
    console.log(currentUser.photoURL);
    gravatarPhoto.src = currentUser.photoURL;
    info.appendChild(gravatarPhoto);

    var name = document.createElement("h1");
    name.classList += " userName";
    name.textContent = user.displayName;
    info.appendChild(name);

    page.append(info);

    //render videos here
}   

function render(snapshot) {
}










