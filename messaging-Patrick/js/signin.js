// add code here that is specific to the sign-in page (index.html)


"use strict";

var signUpForm = document.getElementById("signin-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");

signUpForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    if (passwordInput.value.length < 6){
        alert("You password must be at least 6 characters long.");
    }else {
        firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
            .then(function() {
                window.location = "messages.html";
            })
            .catch(function(err) {
                alert(err.message);
            });
    }
    return false;
});