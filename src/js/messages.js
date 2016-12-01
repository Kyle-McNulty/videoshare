
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


// var mountainsRef = storageRef.child('stevens.jpg');
// var mountainImagesRef = storageRef.child('images/stevens.jpg');


/* Files upload stuff */



  var currentRef = storage.ref();

  currentRef.child("videos/stevens.jpg").getDownloadURL().then(function (url) {
    // Get the download URL for 'images/stars.jpg'
    // This can be inserted into an <img> tag
    // This can also be downloaded directly
    console.log(url);

  }).catch(function (error) {
    // Handle any errors
  });

  var videoList = document.querySelector(".video-list");

  function handleFiles(fileList) {
    if (currentUser.emailVerified) {
      /* Iterates over the returned FileList object */
    console.log("the list is ", fileList);
    var file = fileList[0];
    console.log("file is ",file);
    var storageRef = storage.ref(currentUser.uid + "/" + file.name);
    var uploadTask = storageRef.put(file); // adding to the storage 
      uploadTask.then(function() { // adding to the database
        // console.log(uploadTask.snapshot);
        var info = {
          createdOn: firebase.database.ServerValue.TIMESTAMP, //when created, filled in by Firebase
          fileName: file.name,
          downloadURL: uploadTask.snapshot.downloadURL,
          createdBy: {
            uid: currentUser.uid, //the unique user id
            displayName: currentUser.displayName, //the user's display name
            email: currentUser.email, //the user's email address
            emailHashing: currentUser.photoURL, // 
          }
        };
        personalRef.push(info);
      })    // upload the file into storage
    } else {
      alert("You must verify your email before uploading"); //need to implement some more of this functionality
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
      // Handle unsuccessful uploads
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log(downloadURL);
    });
  }

  var generalRef = firebase.database().ref("general");


  /* 
   * 
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


  function renderMovie(snapshot) {

    var element = snapshot.val();

    var cell = document.createElement("div");
    cell.setAttribute("class", "mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp");
    var media = document.createElement("div");
    media.setAttribute("class", "mdl-card__media");
    var video = document.createElement("video");
    video.setAttribute("controls", "true");
    video.setAttribute("width", "320");  // should change
    video.setAttribute("height", "240");

    var source = document.createElement('source');
    console.log("element is: ");
    console.log(element);
    source.setAttribute('src', element.downloadURL);
    video.appendChild(source);
    video.play();
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "mdl-card__title");
    var title = document.createElement("h4");
    title.setAttribute("class", "mdl-card__title-text");
    title.innerHTML = "";  // title for each video

    titleDiv.appendChild(title);
    media.appendChild(video);
    cell.appendChild(media);
    cell.appendChild(titleDiv);

    videoList.appendChild(cell);
  }

  function render(snapshot) {
    videoList.innerHTML = "";
    snapshot.forEach(renderMovie);
  }

personalRef.limitToLast(100).on("value", render);