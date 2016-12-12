/*
Authors: Calvin Korver, Kyle McNulty, Patrick Yi
This javascript class handles the main index.html file which is the main video feed
*/

var currentUser;
var authProvider = new firebase.auth.GithubAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
  } else {
    firebase.auth().signInWithRedirect(authProvider);
    window.location = "index.html";
  }
});

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
    inputCaption = getCaption(uploadTask);

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
        comments: {

        },
        title: inputCaption,
        Fcount: 0,
      };
      var item = personalRef.push(info);
    })    // upload the file into storage

  } else {
    alert("You must verify your email before uploading");
  }

  uploadTask.on("state_changed", function (snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if (progress < 100) {
      spinner.classList.add("is-active");
    } else {
      spinner.classList.remove("is-active");
    }
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
  });
}

/* Renders each snapshot in the storage by calling the renderMovie method for each snapshot that we get */
function render(snapshot) {
  videoList.innerHTML = "";
  snapshot =
    snapshot.forEach(renderMovie);
}

/* Changes the page to profile page from button input in nav bar */
document.getElementById("profile-page-button").addEventListener("click", function () {
  window.location = "../profile.html";
});

personalRef.startAt().limitToLast(20).on("value", render);

