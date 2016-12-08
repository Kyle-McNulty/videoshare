

/* Handles firebase authentication etc. */
var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
var personalRef = firebase.database().ref("personal");
var bioRef = firebase.database().ref("bio");

var videoList = document.querySelector(".video-list");
firebase.auth().onAuthStateChanged(function (user) {
    //if there is an authenticated user...
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
/**
 * Authors: Calvin Korver, Kyle McNulty, Patrick Yi
 * 
 * This handles the profile page
 */

var page = document.getElementById("page-content");

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
    //render videos here
    personalRef.limitToLast(20).on("value", render);
}


/* This function renders out each move that is in Firebase storage */
function renderMovie(snapshot) {
    if (snapshot.val().createdBy.uid === currentUser.uid) {

        /* Grabs the element from Firebase Storage */
        var element = snapshot.val();
        var cell = document.createElement("div");
        cell.setAttribute("class", "demo-card-wide mdl-card mdl-shadow--2dp video-cell");

        // adding favorite and comment input
        var feedback = document.createElement("div");
        var like = document.createElement("i");
        like.innerHTML = "favorite";
        like.setAttribute("class", "material-icons");
        var comment = document.createElement("form");
        comment.setAttribute("action", "#");
        var comment_div = document.createElement("div");
        comment_div.setAttribute("class", "mdl-textfield mdl-js-textfield");
        var comment_input = document.createElement("input");

        /* Adds the user commenting to the array in the object */
        comment_input.addEventListener("change", function () {
            var input = comment_input.value;
            var tempArray = element.comments;
            tempArray.push(input);

            snapshot.ref.update({
                comments: tempArray
            });
        });

        comment_input.setAttribute("class", "mdl-textfield__input");
        comment_input.setAttribute("type", "text");
        comment_input.setAttribute("id", "sample1");
        var comment_label = document.createElement("label");
        comment_label.setAttribute("class", "mdl-textfield__label");
        comment_label.setAttribute("for", "sample1");
        comment_div.appendChild(comment_input);
        comment_div.appendChild(comment_label);
        comment.appendChild(comment_div);

        feedback.appendChild(like);
        feedback.appendChild(comment);

        /* Handles creation of the video element */
        var media = document.createElement("div");
        var source = document.createElement('source');
        var video = document.createElement("video");
        media.setAttribute("class", "mdl-card__media");
        video.setAttribute("controls", "true");
        video.setAttribute("width", "100%");  // should change
        video.setAttribute("height", "70%");
        source.setAttribute('src', element.downloadURL);
        video.appendChild(source);

        /* Title of the Video */
        var titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "mdl-card__title");
        var title = document.createElement("h2");
        title.setAttribute("class", "mdl-card__title-text");
        title.innerHTML = element.fileName
            .substring(0, element.fileName.length - 4);  // cuts off .mp4


        /* Author */
        var authorDiv = document.createElement("div");
        authorDiv.setAttribute("class", "mdl-card__supporting-text");
        var author = document.createElement("p");
        var name = element.createdBy.displayName;
        var description = "This is a description of the video that can be added in by the user using the metadata property";
        var date = element.createdOn;
        console.log(date);
        date = moment(date).fromNow();
        var br = document.createElement("br");
        var avatar = document.createElement("img");
        avatar.setAttribute("class", "description-avatar");
        avatar.setAttribute("src", element.createdBy.emailHashing);

        author.appendChild(avatar);
        author.innerHTML += name.bold() + " uploaded this " + date;
        author.appendChild(br);

        author.innerHTML += description;
        author.appendChild(br);
        authorDiv.appendChild(author);

        /* Delete Button */
        var buttonDiv = document.createElement("div");
        var button = document.createElement("button");
        button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
        button.innerHTML = "Delete";
        button.addEventListener('click', function () {
            handleDelete(snapshot);
        });
        buttonDiv.appendChild(button);

        /* Appends all child elements to the main video cell object */
        titleDiv.appendChild(title);
        media.appendChild(video);
        cell.appendChild(media);
        cell.appendChild(titleDiv);
        cell.appendChild(authorDiv);
        cell.appendChild(feedback);
        cell.appendChild(buttonDiv);

        /* Appends the cell to the entire feed of videos */
        videoList.appendChild(cell);
    }
}

// deletes a video from the database and storage
function handleDelete(snapshot) {
    if (snapshot.val().createdBy.uid != currentUser.uid) {
        alert("You cant change or delete a message that isn't yours");
        return;
    }
    var dialog = document.querySelector('.mdl-dialog');

    /* If no support for dialogs */
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    dialog.showModal();

    dialog.querySelector('.delete').addEventListener('click', function () {
        snapshot.ref.remove();
        dialog.close();
    });

    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

/* Renders each snapshot in the storage by calling the renderMovie method for each snapshot that we get */
function render(snapshot) {
    videoList.innerHTML = "";
    snapshot.forEach(renderMovie);
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









