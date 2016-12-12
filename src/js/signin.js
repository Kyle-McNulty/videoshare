/**
 * Authors: Calvin Korver, Kyle McNulty, Patrick Yi
 * 
 * This handles the signing in page
 */

"use strict";

var signInForm = document.getElementById("signin-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var errorMessage = document.getElementById("error-message");
var loading = document.querySelector(".loading");

/* Checks the password for appropriate length */
function checks() {
    var checks = false;
    var error = document.createElement("span");
    if (passwordInput.value.length < 6) {
        error.textContent = "Your password must be more than 6 characters!";
    } else {
        checks = true;
    }
    errorMessage.appendChild(error);
    return checks;
}

/* Handles submitting the email and the passord */
signInForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    errorMessage.innerHTML = "";
    if(checks()) {   
        toggleFeedback();    
        firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
            .then(function() {
                window.location = "videos.html";
                toggleFeedback();
            })
            .catch(function(err) {
                alert(err.message);
            })
    }  
    return false;
});

function toggleFeedback() {
    loading.classList.toggle("hidden");
}