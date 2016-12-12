

// var currentUser;
// var authProvider = new firebase.auth.GithubAuthProvider();
// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     currentUser = user;
//   } else {
//     firebase.auth().signInWithRedirect(authProvider);
//     window.location = "index.html";
//   }
// });

document.getElementById("sign-out-button").addEventListener("click", function () {
  firebase.auth().signOut();
});

var storage = firebase.storage();
var personalRef = firebase.database().ref("personal");
/* Files upload stuff */
var currentRef = storage.ref();
var videoList = document.querySelector(".video-list");
var inputCaption;
var liked = false;
var spinner = document.querySelector(".mdl-spinner");

function getCaption(uploadTask) {
  uploadTask.pause();
  inputCaption = "";
  var dialogCap = document.querySelector(".caption");
  var input = document.getElementById("captionInput");
  var doneButton = document.querySelector(".done");
  var cancelButton = document.querySelector(".cancel");

  dialogCap.showModal();
  cancelButton.addEventListener("click", function () {
    uploadTask.cancel();
    dialogCap.close();
  });

  doneButton.addEventListener("click", function () {
    console.log("input !!!", input.value);
    var replace = input.value;
    if (replace != null) {
      inputCaption = replace;
    }
    uploadTask.resume();
    dialogCap.close();
  });
}


/*
 * This method handles the deleting of a video from the feed
 *  
 **/
function handleDelete(snapshot) {
  if (snapshot.val().createdBy.uid != currentUser.uid) {
    alert("You cant change or delete a message that isn't yours");
    return;
  }
  var dialog = document.querySelector('.deleteDialog');

  /* If no support for dialogs */
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  dialog.showModal();
  var itemRef = currentRef.child(currentUser.uid + "/" + snapshot.val().fileName)
  dialog.querySelector('.delete').addEventListener('click', function () {
    snapshot.ref.remove();
    itemRef.delete();
    dialog.close();
  });

  dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
  });
}

var generalRef = firebase.database().ref("general");

/* 
 * Handles changing text on the material design lite upload selector
 * 
 * Courtesy of Alexander Gaziev from
 * https://codepen.io/alexander-gaziev/pen/JdVQQm 
 * 
 **/


function likeHandler(element, snapshot) {
  // var countRef = snapshot.ref.child("Fcount");
  // var likedBy = snapshot.ref.child("likedBy");
  // var likedByUser = { user: currentUser.displayName }
  // // if current user has already like this video, unlike the video
  // if (element.likedBy) {
  //   var alreadyLiked = true;
  //   for (var key in element.likedBy) {
  //     if (element.likedBy[key].user != currentUser.displayName) {
  //       alreadyLiked = false;
  //       countRef.set(element.Fcount + 1);
  //       likedBy.push(likedByUser);
  //     }
  //   }
  //   if (alreadyLiked) {
  //     countRef.set(element.Fcount - 1);
  //     likedBy.remove(likedBy.user);
  //   }
  //   //likedBy.remove(likedBy.user);
  // } else {
  //   countRef.set(element.Fcount + 1);
  //   likedBy.push(likedByUser);
  // }
  var favoriteUserRef = snapshot.ref.child("favoriteUser");
  var countRef = snapshot.ref.child("Fcount");
  favoriteUserRef.push({
    user: currentUser.displayName,
  });
  if (!liked) {
    countRef.set(element.Fcount + 1);
    liked = !liked;
  } else {
    countRef.set(element.Fcount - 1);
    liked = !liked;
  }
}

/* This function renders out each move that is in Firebase storage */
function renderMovie(snapshot) {
  console.log(snapshot.val());
  //console.log("key here", snapshot.key);


  /* Grabs the element from Firebase Storage */
  var element = snapshot.val();
  var cell = document.createElement("div");
  cell.setAttribute("class", "demo-card-wide mdl-card mdl-shadow--2dp video-cell");

  // adding favorite and comment input
  var feedBackDiv = document.createElement("div");
  var commentSpan = document.createElement("span");

  /* Creating the pencil icon for commenting */
  var commentPencil = document.createElement("i");
  commentPencil.setAttribute("id", "commentPencil");
  commentPencil.classList += " fa fa-pencil";
  commentPencil.setAttribute("aria-hidden", "true");

  var commentTooltip = document.createElement("div");
  commentTooltip.setAttribute("class", "mdl-tooltip");
  commentTooltip.setAttribute("data-mdl-for", "commentPencil");


  var likeSpan = document.createElement("span");
  var likeButton = document.createElement("button");
  likeButton.setAttribute("class", "mdl-button mdl-js-button mdl-button--icon")
  var like = document.createElement("i");
  like.innerHTML = "favorite border";
  like.setAttribute("class", "material-icons  mdl-button--colored red");
  var favoriteBy = document.createElement("span");
  var likeString = "likes";
  if (element.Fcount == 1) {
    likeString = "like";
  }
  favoriteBy.innerHTML = "" + element.Fcount + " " + likeString;
  likeButton.appendChild(like);
  likeSpan.appendChild(likeButton);
  likeSpan.appendChild(favoriteBy);


  /* Creates the form for the comment inputs */
  var commentForm = document.createElement("form");
  commentForm.setAttribute("action", "#");
  var comment_div = document.createElement("div");
  comment_div.setAttribute("class", "mdl-textfield mdl-js-textfield");
  // var comment_input_span = document.createElement("span");
  var comment_input = document.createElement("input");

  /* Adds the user commenting to the array in the object */
  comment_input.addEventListener("change", function () {
    var input = comment_input.value;
    var commentRef = snapshot.ref.child("comments");
    var user = currentUser.displayName;
    commentRef.push({
      input: input,
      user: user
    });
  });

  /* Handles click for the like button */
  likeButton.addEventListener("click", function () {
    likeHandler(element, snapshot);
  });

  var display = document.createElement("div");  // display the like count and all comment
  var commentsList = document.createElement("div");

  var commentRef = snapshot.ref.child("comments");
  display.appendChild(commentsList);

  var comment_input_span = document.createElement("span");
  comment_input.setAttribute("class", "mdl-textfield__input");
  comment_input.setAttribute("type", "text");
  comment_input.setAttribute("id", "sample1");
  var comment_label = document.createElement("label");
  comment_label.setAttribute("class", "mdl-textfield__label");
  comment_label.setAttribute("for", "sample1");
  commentSpan.appendChild(commentPencil);
  commentSpan.appendChild(commentTooltip);
  commentSpan.appendChild(comment_input);
  comment_div.appendChild(commentSpan);
  comment_div.appendChild(comment_label);
  comment_input_span.appendChild(comment_div);




  /* Appends the commenting pencil icon onto our comment input span */
  // commentForm.appendChild(favoriteBy);
  // commentForm.appendChild(likeButton);
  commentForm.appendChild(commentPencil);
  commentForm.appendChild(comment_input_span);

  display.classList += " display";
  feedBackDiv.classList += " display";


function renderComment(){

}
  var comments = document.createElement("ul");
  if (element.comments) {
    for (var key in element.comments) {
      var commentSpan = document.createElement("span");
      commentSpan.classList += " commentSpan";
      var commentWriting = document.createElement("p");

      commentWriting.textContent = element.comments[key].input;
      var commentUser = document.createElement("p");
      commentUser.textContent = element.comments[key].user + ":\xa0 ";
      commentUser.classList += " commentUser";

      commentSpan.appendChild(commentUser);
      commentSpan.appendChild(commentWriting);
      comments.appendChild(commentSpan);
    }
  }


  /* Appends the "like" span containing like button onto the feedback div */
  feedBackDiv.appendChild(likeSpan);
  feedBackDiv.appendChild(commentForm);
  
  /* Handles creation of the video element */
  var media = document.createElement("div");
  var source = document.createElement('source');
  var video = document.createElement("video");
  media.setAttribute("class", "mdl-card__media");
  video.setAttribute("controls", "true");
  video.setAttribute("preload", "auto");
  video.setAttribute("width", "100%");  // should change
  video.setAttribute("height", "70%");
  // console.log("element is: ");
  // console.log(element);
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

  var description = element.title;
  var br = document.createElement("br");
  var description = "Description: " + element.title;
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
  cell.appendChild(feedBackDiv);
  cell.appendChild(display);
  cell.appendChild(comments);
  cell.appendChild(buttonDiv);

  /* Appends the cell to the entire feed of videos */
  videoList.appendChild(cell);
}