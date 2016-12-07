
var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
  //if there is an authenticated user...
  if (user) {
    currentUser = user;
    // console.log(currentUser.uid);
  } else {
    firebase.auth().signInWithRedirect(authProvider);
    window.location = "index.html";
  }
});

document.getElementById("sign-out-button").addEventListener("click", function () {
  firebase.auth().signOut();
});

var storage = firebase.storage();

var personalRef = firebase.database().ref("personal");
var randomRef = firebase.database().ref("random");

/* Files upload stuff */
var currentRef = storage.ref();

var videoList = document.querySelector(".video-list");

function handleFiles(fileList) {
  if (currentUser.emailVerified) {
    
    /* Iterates over the returned FileList object */
    var file = fileList[0];
    var fileName = file.name;
    if (fileName.substring(fileName.length - 3, fileName.length) !== ("mp4")) {
      alert("File must be of the mp4");
      return;
    }

    var storageRef = storage.ref(currentUser.uid + "/" + file.name);
    var uploadTask = storageRef.put(file); // adding to the storage 
    uploadTask.then(function () { // adding to the database
      var info = {
        createdOn: firebase.database.ServerValue.TIMESTAMP,
        fileName: file.name,
        downloadURL: uploadTask.snapshot.downloadURL,
        createdBy: {
          uid: currentUser.uid, //the unique user id
          displayName: currentUser.displayName, //the user's display name
          email: currentUser.email, //the user's email address
          emailHashing: currentUser.photoURL, // 
        },
        comments: []
      };
      personalRef.push(info);
    })    // upload the file into storage
  } else {
    alert("You must verify your email before uploading");
  }


  uploadTask.on("state_changed", function (snapshot) {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function (error) {
    alert(error);
  }, function () {
    var downloadURL = uploadTask.snapshot.downloadURL;
    console.log(downloadURL);
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
  var dialog = document.querySelector('.mdl-dialog');

  /* If no support for dialogs */
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  dialog.showModal();

  dialog.querySelector('.delete').addEventListener('click', function () {
    console.log(snapshot.ref);
    snapshot.ref.remove();
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
var fileInputTextDiv = document.getElementById('file_input_text_div');
var fileInput = document.getElementById('file_input_file');
var fileInputText = document.getElementById('file_input_text');

fileInput.addEventListener('change', changeInputText);
fileInput.addEventListener('change', changeState);

function changeInputText() {
  var str = fileInput.value;
  var i;
  if (str.lastIndexOf('\\')) {
    i = str.lastIndexOf('\\') + 1;
  } else if (str.lastIndexOf('/')) {
    i = str.lastIndexOf('/') + 1;
  }
  fileInputText.value = str.slice(i, str.length);
}

function changeState() {
  if (fileInputText.value.length != 0) {
    if (!fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.add('is-focused');
    }
  } else {
    if (fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.remove('is-focused');
    }
  }
}

/* This function renders out each move that is in Firebase storage */
function renderMovie(snapshot) {
  console.log(snapshot.val());
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
  comment_input.addEventListener("change", function() {
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
   var description = "This is a description of the video that can be added in by the user using the metadata property";
   var date = element.createdOn;
   console.log(date);
   date = moment(date).fromNow();
   var br = document.createElement("br");
   var avatar = document.createElement("img");
   avatar.setAttribute("class", "description-avatar");
   avatar.setAttribute("src", element.createdBy.emailHashing);
    
    author.appendChild(avatar);
    author.innerHTML +=  name.bold() + " uploaded this " + date;
    author.appendChild(br);
    
    author.innerHTML += description;
  author.appendChild(br);
  authorDiv.appendChild(author);
  
  /* Video Description */
  // var descriptionDiv = document.createElement("div");
  // descriptionDiv.setAttribute("class", "mdl-card__supporting-text");

  // authorDiv.appendChild(description);
  var buttonDiv = document.createElement("div");
  var button = document.createElement("button");
  button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
  button.innerHTML = "Delete";
  button.addEventListener('click', function(){
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
  // cell.appendChild(descriptionDiv);

  /* Appends the cell to the entire feed of videos */
  videoList.appendChild(cell);
}

/* Renders each snapshot in the storage by calling the renderMovie method for each snapshot that we get */
function render(snapshot) {
  // var videoList = document.querySelector(".video-list")
  // var content = document.querySelector(".page-content");
  // content.innerHTML= "";
  videoList.innerHTML = "";
  snapshot.forEach(renderMovie);
}

/* Changes the page to profile page from button input in nav bar */
document.getElementById("profile-page-button").addEventListener("click", function () {
  console.log("Changing page");
  window.location = "../profile.html";
});

personalRef.limitToLast(20).on("value", render);