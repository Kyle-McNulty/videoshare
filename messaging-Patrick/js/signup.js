//add code here that is specific to the sign-up page (signup.html)

"use strict";

var signUpForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var passwordConfirmation = document.getElementById("passwordConfirmation");
var displayNameInput = document.getElementById("display-name-input");

signUpForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    if(displayNameInput.value.length == 0){
        alert("Your name can not be blank");
    }else if (passwordInput.value.length < 6){
        alert("You password must be at least 6 characters long.");
    } else if (passwordInput.value != passwordConfirmation.value){
        alert("The password confirmation should must match the password");
    } else{
        firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(user) {
            user.sendEmailVerification();
            alert("Check verification email");

            return user.updateProfile({
                displayName: displayNameInput.value,
                photoURL:"https://www.gravatar.com/avatar/" + md5(emailInput.value)
            });
        })
        .then(function() {
            window.location = "messages.html";
        })
        .catch(function(err) {
            alert(err.message);
        });       
    }
    return false;
});