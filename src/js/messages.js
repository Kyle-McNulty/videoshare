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

var storage = firebase.storage();


// var mountainsRef = storageRef.child('stevens.jpg');
// var mountainImagesRef = storageRef.child('images/stevens.jpg');


/* Files upload stuff */

function handleFiles(fileList) {
    /* Iterates over the returned FileList object */
    for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        var storageRef = storage.ref("videos/" + file.name);
        var metadata = {
            owner: "TEST"
        };
        var uploadTask = storageRef.put(file, metadata);

        uploadTask.on("state_changed", function(snapshot) {
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
            }, function(error) {
            // Handle unsuccessful uploads
            }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
            });
    }
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
