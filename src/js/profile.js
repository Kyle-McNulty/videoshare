

/* Handles firebase authentication etc. */
var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
    //if there is an authenticated user...
    if (user) {
        currentUser = user;
        loadPage();
        // console.log(currentUser);
    } else {
        firebase.auth().signInWithRedirect(authProvider);
        window.location = "index.html";
    }
});

document.getElementById("sign-out-button").addEventListener("click", function (){
    firebase.auth().signOut();
});




/* Changes the page to profile page from button input in nav bar */
document.getElementById("feed-page-button").addEventListener("click", function (){
  console.log("Changing page");
  window.location = "../videos.html";
});

var page = document.getElementById("page-content");

var li = document.createElement("li");  //create an <li> element
li.className += " mdl-list__item";

function loadPage() {
console.log(currentUser);
  
}
    // /* Creating image avatar */
    // var gravatarPhoto = document.createElement("img");
    // gravatarPhoto.src = currentUser.photoURL;
    // console.log(gravatarPhoto.source);


    // gravatarPhoto.className += " gravatar-photo";
    // li.append(gravatarPhoto);








