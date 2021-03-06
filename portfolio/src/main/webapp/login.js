// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Toggle a button to be disabled or not disabled
 */
function toggleButton(button, parityBool) {
  button.disabled = parityBool;
}

/**
 * Do toggleButton for all buttons in a class
 */
function toggleButtons(buttons, parityBool) {
  for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
    toggleButton(buttons.item(buttonIndex), parityBool);
  }
}

/**
 * Make sure user is logged in, and alter elements in the dom to be 
 * responsive or not based on that. 
 */
function checkLogin() {
  fetch("/check-login").then(response => response.json()).then(userInfo => 
  {
    const submitCommentButton = document.getElementById("submit-comment");
    const logInOutForm = document.getElementById("log-in-out");
    const logInOutButton = document.createElement("button");
    logInOutForm.appendChild(logInOutButton);

    const deleteButtons = document.getElementsByClassName("delete-button");
    if (userInfo.loggedIn) {
      toggleButton(submitCommentButton, false);
      toggleButtons(deleteButtons, false);

      logInOutButton.innerText = "Log Out"; 
      logInOutForm.action = userInfo.logoutUrl;
    } else {
      toggleButton(submitCommentButton, true);
      toggleButtons(deleteButtons, true);

      logInOutButton.innerText = "Log In"; 
      logInOutForm.action = userInfo.loginUrl;
    }
  })
}

checkLogin();