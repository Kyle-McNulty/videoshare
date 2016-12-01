//add code here that is specific to the messages page (messages.html)
"use strict";

//will be set to the currently authenticated user

var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
    } else {
        alert("please sign in your account");
        window.location = "index.html";
    }
});


var chatForm = document.querySelector(".new-chat-form");
var chatTitleInput = chatForm.querySelector(".new-chat-title");
var chatList = document.querySelector(".chat-list");
var chatsRef = firebase.database().ref("general");
var randomRef = firebase.database().ref("random");
var channelSwap = true;
var channelName = document.querySelector("#channel-name");
var signOut = document.querySelector("#sign-out");



//whenver the submit event on the form occurs...
chatForm.addEventListener("submit", function(evt) {
    //tell the browser to not do its default behavior
    //so that we can handle this locally
    evt.preventDefault();

    if (currentUser.emailVerified) {
        var chat = {
            title: chatTitleInput.value.trim(),
            done: false,
            createdOn: firebase.database.ServerValue.TIMESTAMP, //when created, filled in by Firebase
            createdBy: {
                uid: currentUser.uid, //the unique user id
                displayName: currentUser.displayName, //the user's display name
                email: currentUser.email, //the user's email address
                emailHashing: currentUser.photoURL
            }

        };


        if (channelSwap) {
            chatsRef.push(chat);
        } else {
            randomRef.push(chat);
        }
    } else {
        alert("You have to verify you email first and sign in again");
    }


    //clear the task title input so we can type in
    //another task
    chatTitleInput.value = "";

    //for older browsers...
    return false;
});


function renderChat(snapshot) {

    var chat = snapshot.val();

    var li = document.createElement("li"); //create an <li> element

    var imgDiv = document.createElement("div");
    imgDiv.setAttribute("class", "profile");
    var img = document.createElement("img");
    img.setAttribute("src", currentUser.photoURL);
    imgDiv.appendChild(img);
    li.appendChild(imgDiv);


    var chatCreation = document.createElement("p");
    chatCreation.classList.add("chat-creation");
    chatCreation.textContent = (chat.createdBy.displayName) + " " +
    moment(chat.createdOn).fromNow(); 
    li.appendChild(chatCreation);

    var chatTitle = document.createElement("span");
    chatTitle.textContent = chat.title;
    chatTitle.classList.add("chat-title");
    li.appendChild(chatTitle);

    chatTitle.addEventListener("click", function() {
        snapshot.ref.update({
            done: !chat.done
        });
    });


    //if the taks is marked as done...
    if (chat.done) {
        //add a style class so we can format it differenty
        li.classList.add("done");


        //add a delete button so the user can delete it
        var buttonDelete = document.createElement("span");
        buttonDelete.classList.add("glyphicon", "glyphicon-trash");

        var buttonE = document.createElement("button");
        buttonE.innerHTML = "Edit";
        buttonE.setAttribute("class", "mdl-button");
        buttonE.setAttribute("type", "button");
        buttonE.setAttribute("id", "show-dialog");

        //add pop up dialog
        var dialog = document.createElement("dialog");
        dialog.setAttribute("class", "mdl-dialog");
        var form = document.createElement("form");
        var h4 = document.createElement("h4");
        h4.innerHTML = "Editting your message";
        var input = document.createElement("input");
        input.setAttribute("id", chat.createdOn);
        input.setAttribute("type", "text");
        var doneButton = document.createElement("button");
        doneButton.setAttribute("type", "button");
        doneButton.setAttribute("class", "mdl-button");
        doneButton.innerHTML = "Done";
        var cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button");
        cancelButton.setAttribute("class", "mdl-button");
        cancelButton.innerHTML = "Cancel";

        dialog.appendChild(h4);
        form.appendChild(input);
        form.appendChild(doneButton);
        form.appendChild(cancelButton);
        dialog.appendChild(form);

        if (currentUser.email == chat.createdBy.email) {
            buttonDelete.addEventListener("click", function(evt) {
                snapshot.ref.remove();
            });
            buttonE.addEventListener("click", function() {
                dialog.showModal();
            });
        }
        cancelButton.addEventListener("click", function() {
            dialog.close();
        });

        doneButton.addEventListener("click", function() {
            var replace = document.getElementById(chat.createdOn).value;
            snapshot.ref.update({
                title: replace,
                createdOn: firebase.database.ServerValue.TIMESTAMP
            });
            dialog.close();
        });


        li.appendChild(buttonDelete);
        li.appendChild(buttonE);
        li.appendChild(dialog);
    }

    chatList.appendChild(li);
}


function render(snapshot) {
    chatList.innerHTML = "";
    snapshot.forEach(renderChat);
}

signOut.addEventListener("click", function() {
    firebase.auth().signOut()
        .then(function() {
            window.location = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
});




channelName.innerHTML = "#general";
chatsRef.on("value", render);


var navigationSelector = document.querySelector(".navigation");

navigationSelector.addEventListener("click", function(element) {
    var value = element.target.id;

    if (value == "random") {
        channelName.innerHTML = "#random";
        channelSwap = false;
        randomRef.on("value", render);
    } else if (value == "general") {
        channelName.innerHTML = "#general";
        channelSwap = true;
        chatsRef.on("value", render);
    }

});