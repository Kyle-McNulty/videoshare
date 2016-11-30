
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



  // console.log(currentRef);


  function handleFiles(fileList) {
    /* Iterates over the returned FileList object */
    console.log("the list is ", fileList);
    var file = fileList[0];
    console.log("file is ",file);
    var storageRef = storage.ref(currentUser.uid + "/" + file.name);
    var uploadTask = storageRef.put(file);    // upload the file into storage

    if (currentUser.emailVerified) {
      var info = {
        createdOn: firebase.database.ServerValue.TIMESTAMP, //when created, filled in by Firebase
        fileName: file.name,
        createdBy: {
          uid: currentUser.uid, //the unique user id
          displayName: currentUser.displayName, //the user's display name
          email: currentUser.email, //the user's email address
          emailHashing: currentUser.photoURL // 
        }
      };
      personalRef.push(info);
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
    video.setAttribute("control");
    video.setAttribute("width", "320");  // should change
    video.setAttribute("height", "240");

    var source = document.createElement('source');
    source.setAttribute('src', 'http://www.tools4movies.com/trailers/1012/Kill%20Bill%20Vol.3.mp4'); // should revise
    video.appendChild(source);
    video.play();
    var titileDiv = document.createElement("div");
    titileDiv.setAttribute("class", "mdl-card__title");
    var titile = document.createElement("h4");
    titile.setAttribute("class", "mdl-card__title-text");
    titile.innerHTML = "";  // titile for each video

    titileDiv.appendChild(titile);
    media.appendChild(video);
    cell.appendChild(media);
    cell.appendChild(titileDiv);

  }

  // function render(snapshot) {
  //   chatList.innerHTML = "";
  //   snapshot.forEach(renderChat);
  // }

