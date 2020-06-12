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
 * Load comments page wise based on user selection 
 */
function loadComments() {
  var commentLimit = getCommentLimit();
  fetch('/num-comments').then(response => response.text()).then(numComments =>
  {
    var numPages = Math.ceil(numComments/commentLimit);
    var commentsDiv = document.getElementById("comments");
    for (var pageNumber = 0; pageNumber < numPages; pageNumber++) {
      const thisPageNumber = pageNumber;

      var pageElement = document.createElement("a");
      pageElement.innerText = thisPageNumber;
      pageElement.href = "#";
      pageElement.addEventListener('click', () => {
        //load comments on pageNumber
        addMessage(thisPageNumber, getSortMethod());
      });

      commentsDiv.appendChild(pageElement);
    }
  })
  .catch(error => {console.log("failed to get num comments, oops!");});
}


/**
 * Using fetch request content from servlet and add to home page
 */
function addMessage(pageNumber = 0, sortMethod = {"feature": "timestamp", 
                                                  "direction": "DESCENDING"}) 
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

  var commentElement = document.createElement("p");
  commentElement.innerText = `${comment.comment} posted at ${comment.timestamp}`;

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.innerText = "Delete comment";
  deleteButtonElement.addEventListener('click', () => {
    //remove from datastore and DOM
    deleteComment(comment);
    messageDiv.remove();
  });

  var upvoteAndButtonElements = document.createElement("div");
  var upvoteElement = document.createElement("p");
  var numUpvotes = Comment.upvotes;
  upvoteElement.innerText = numUpvotes.toString() + " upvotes";

  var upvoteButtonElement = document.createElement("button");
  upvoteButtonElement.innerText = "Upvote";
  upvoteButtonElement.addEventListener('click', () => {
    numUpvotes++;
    upvoteElement.innerText = numUpvotes + " upvotes";
    upvoteComment(Comment);
  });

  upvoteAndButtonElements.appendChild(upvoteElement);
  upvoteAndButtonElements.appendChild(upvoteButtonElement);
  
  messageDiv.appendChild(commentElement);
  messageDiv.appendChild(upvoteAndButtonElements);
  messageDiv.appendChild(deleteButtonElement);
  return messageDiv;
}

function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}

function upvoteComment(Comment) {
  const params = new URLSearchParams(); 
  params.append('id', Comment.id);
  params.append('upvotes', Comment.upvotes + 1)
  params.append('comment', Comment.comment);
  params.append('timestamp', Comment.timestamp)
  fetch("/upvote-comment", {method: 'POST', body: params});

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
loadComments();