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

function toggleButton(button, parity) {
  button.disabled = parity;
}

function toggleButtons(buttons, parity) {
  for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
    toggleButton(buttons.item(buttonIndex), parity);
  }
}


function checkLogin() {
  fetch("/check-login").then(response => response.json()).then((userInfo) => {
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