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
 * Erases all inner HTML content within message-container div
 */
function clearMessageDiv() {
  document.getElementById("message-container").innerHTML = "";
}

/**
 * Load more comments page wise based on user selection 
 */
function moreComments() {
  var commentLimit = getCommentLimit();
  fetch('/num-comments').then(response => response.text()).then(numComments =>
  {
    var numPages = Math.ceil(numComments/commentLimit);
    var moreCommentsDiv = document.getElementById("more-comments");
    for (var pageNumber = 0; pageNumber < numPages; pageNumber++) {
      const thisPageNumber = pageNumber;

      var pageElement = document.createElement("a");
      pageElement.innerText = thisPageNumber;
      pageElement.href = "#";
      pageElement.addEventListener('click', () => {
        // load comments on pageNumber
        addMessage(thisPageNumber, getSortMethod());
      });

      moreCommentsDiv.appendChild(pageElement);
    }
  })
  .catch(error => {console.log("failed to get num comments, oops!" + error);});
}


/**
 * Using fetch request content from servlet and add to home page
 */
function addMessage(pageNumber = 0, sortMethod = {"feature": "timestamp", 
                                                  "direction": "true"}) 
{
  const commentLimit = getCommentLimit();
  clearMessageDiv();

  const url = [`/data?pageNumber=${pageNumber}`,
              `commentLimit=${commentLimit}`,
              `sortFeature=${sortMethod.feature}`,
              `sortDirection=${sortMethod.direction}`].join("&");

  fetch(url).then(response => response.json()).then((quote) => {
    const messageContainerDiv = document.getElementById("message-container");
    quote.forEach(comment => messageContainerDiv
                            .appendChild(createMessageElements(comment)));
  });
}


/**
 * Build the elements of an individual message using JSON data
 * Also create a delete button
 */
function createMessageElements(comment) {
  var messageDiv = document.createElement("div");
  messageDiv.className = "message-box";

  //get actual comment and load it into the DOM 
  var commentParent = document.createElement("div");
  commentParent.className = "comment";
  var commentElement = document.createElement("p");
  commentElement.innerText = [comment.comment, 
                              "...from", 
                              comment.userName, 
                              "at", 
                              comment.timestamp].join(" ");

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.className = "delete-button";
  deleteButtonElement.innerText = "Delete comment";
  deleteButtonElement.addEventListener('click', () => {
    // remove from datastore and DOM
    deleteComment(comment, messageDiv);
  });

  var upvoteAndButtonElements = document.createElement("div");
  var upvoteElement = document.createElement("p");
  var numUpvotes = comment.upvoteCount;
  console.log(numUpvotes);
  upvoteElement.innerText = numUpvotes.toString() + " upvotes";

  var upvoteButtonElement = document.createElement("button");
  upvoteButtonElement.innerText = "Upvote";
  upvoteButtonElement.addEventListener('click', () => {
    numUpvotes++;
    upvoteElement.innerText = numUpvotes + " upvotes";
    upvoteComment(comment);
  });

  upvoteAndButtonElements.appendChild(upvoteElement);
  upvoteAndButtonElements.appendChild(upvoteButtonElement);
  
  messageDiv.appendChild(commentElement);
  messageDiv.appendChild(upvoteAndButtonElements);
  messageDiv.appendChild(deleteButtonElement);

  //make the upvote count element
  var upvoteCountParent = document.createElement("div");
  upvoteCountParent.className = "comment-button";
  var upvoteCountElement = document.createElement("p");
  var numUpvotes = comment.upvoteCount;

  upvoteCountElement.innerText = numUpvotes.toString() + " upvotes";
  upvoteCountParent.appendChild(upvoteCountElement);

  //make the upvote button
  var upvoteButtonElement = document.createElement("button");
  upvoteButtonElement.className = "comment-button";
  upvoteButtonElement.innerText = "Upvote";
  upvoteButtonElement.addEventListener('click', () => {
    numUpvotes++;
    upvoteCountElement.innerText = numUpvotes + " upvotes";
    upvoteComment(comment);
  });

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.className = "comment-button";
  deleteButtonElement.innerText = "Delete comment";
  deleteButtonElement.addEventListener('click', () => {
    //remove from datastore and DOM
    deleteComment(comment);
    messageDiv.remove();
  });
  
  commentButtons.appendChild(upvoteCountParent);
  commentButtons.appendChild(upvoteButtonElement);
  commentButtons.appendChild(deleteButtonElement);
  
  messageDiv.appendChild(commentParent);
  messageDiv.appendChild(commentButtons);

  return messageDiv;
}

function deleteComment(comment, messageDiv) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params})
  .then(response => response.json())
  .then(userInfo => 
  {
    if (userInfo.loggedIn) {
      messageDiv.remove(); //delete only possible with log in 
    } else {
      window.location = userInfo.loginUrl;
  .then(response => 
  {
    var status = response.status;
    if (status == 200) { // SC_OK
        // delete only possible with login and same id as author
        messageDiv.remove(); 
    } else if (status == 403) { // SC_FORBIDDEN
      alert("You can only delete your own comment.");
    } else if (status == 401) { // SC_UNAUTHORIZED
      alert("You must be logged in to delete a comment.");
    } else { 
      alert("Something broke while trying to delete this comment");
    }
  });
}


function upvoteComment(comment) {
  const params = new URLSearchParams(); 
  params.append('id', comment.id);
  params.append('upvoteCount', comment.upvoteCount);
  fetch("/upvote-comment", {method: 'POST', body: params});
}

function upvoteComment(comment) {
  const params = new URLSearchParams(); 
  params.append('id', comment.id);
  params.append('upvoteCount', comment.upvoteCount + 1)
  fetch("/upvote-comment", {method: 'POST', body: params});
}
/**
 * Basic test to check well typed and apply some bounds
 */

function isWithinBounds(number, lo, hi) {
    return !isNaN(number) && parseInt(number) > lo && parseInt(number) < hi; 
}

function getCommentLimit() {
  let pageParams = (new URL(document.location)).searchParams;
  let commentLimit = pageParams.get("commentLimit");

  const hiBound = 1000;
  if(!commentLimit || commentLimit.length == 0 || 
      !isWithinBounds(commentLimit, 0, hiBound)) {
    commentLimit = "5"; //reset to some default if malformed input
  }
  
  //update the text box to display the amount after refresh 
  document.getElementById("commentLimit").value = parseInt(commentLimit);
  return commentLimit;
}

function getSortDirection() {
  var sortDirectionOptions = document.getElementById("sortDirection");

  var sortDirection = 
      sortDirectionOptions.options[sortDirectionOptions.selectedIndex].value;

function getSortMethod() {
  var sortMethodOptions = document.getElementById("sortMethod");
  var sortMethod = 
      sortMethodOptions.options[sortMethodOptions.selectedIndex].value;

  var splitSortMethod = sortMethod.split(" ");

  return {"feature": splitSortMethod[0], "direction": splitSortMethod[1]};
}

function applySortMethod() {
  addMessage(0, getSortMethod());
}

addMessage();
moreComments();