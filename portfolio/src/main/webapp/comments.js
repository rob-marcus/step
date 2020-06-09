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

// TODO: Rewrite with a general class to keep track of things more easily...

/**
 * Clear the message div
 */
function clearMessageDiv() {
  document.getElementById("message-container").innerHTML = "";
}


/**
 * Return the TOTAL number of undeleted comments currently in datastore 
 */
function numComments() {
  (fetch('/num-comments').then(response => response.text()).then(num => {
    return num;
  }));
}

/**
 * Very basic pagination feature...
 * Needs to be refined to have an upper limit on number of page buttons
 */
function pagination() {
  var commentLimit = getCommentLimit();
  (fetch('/num-comments').then(response => response.text()).then(numComments =>
  {
    var numPages = Math.ceil(numComments/commentLimit);
    var paginationDiv = document.getElementById("pagination");
    for (var pageNumber = 0; pageNumber < numPages; pageNumber++) {
      const thisPageNumber = pageNumber;

      var pageElement = document.createElement("a");
      pageElement.innerText = thisPageNumber;
      pageElement.href = "#";
      pageElement.addEventListener('click', () => {
        //load comments on pageNumber
        addMessage(thisPageNumber, getSortMethod());
      });

      paginationDiv.appendChild(pageElement);
    }
  }));
}


/**
 * Using fetch request content from servlet and add to home page
 */
function addMessage(pageNumber = 0, sortMethod = "true") {
  const commentLimit = getCommentLimit();
  clearMessageDiv();
  const url = `/data?pageNumber=${pageNumber}&commentLimit=${commentLimit}&sortMethod=${sortMethod}`;
  fetch(url).then(response => response.json()).then((quote) => {
    const messageContainerDiv = document.getElementById("message-container");
    quote.forEach(Comment => messageContainerDiv.appendChild(createMessageElements(Comment)));
  });
}

/**
 * Build the elements of an individual message using JSON data
 * Also create a delete button
 */
function createMessageElements(Comment) {
  var messageDiv = document.createElement("div");

  var commentElement = document.createElement("p");
  commentElement.innerText = `${Comment.comment} posted at ${Comment.timestamp}`;

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.innerText = "Delete comment";
  deleteButtonElement.addEventListener('click', () => {
    //remove from datastore and DOM
    deleteComment(Comment);
    messageDiv.remove();
  });

  var likeAndButtonElements = document.createElement("div");
  var likesElement = document.createElement("p");
  var likes = 0;
  likesElement.innerText = likes.toString() + " upvotes";

  var likeButtonElement = document.createElement("button");
  likeButtonElement.innerText = "Upvote";
  likeButtonElement.addEventListener('click', () => {
    //TODO: ADD BACKEND SUPPORT FOR THIS...
    likes++;
    likesElement.innerText = likes + " upvotes";
  });

  likeAndButtonElements.appendChild(likesElement);
  likeAndButtonElements.appendChild(likeButtonElement);
  
  messageDiv.appendChild(commentElement);
  messageDiv.appendChild(likeAndButtonElements);
  messageDiv.appendChild(deleteButtonElement);
  return messageDiv;
}

function deleteComment(Comment) {
  const params = new URLSearchParams();
  params.append('id', Comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}
/**
 * Basic test to check well typed and apply some bounds
 */
function isValidNumInp(numberInp) {
  const isValidInp = !isNaN(numberInp);
  return isValidInp && (parseInt(numberInp) > 0 && parseInt(numberInp) < 1000);
}

function getCommentLimit() {
  let pageParams = (new URL(document.location)).searchParams;
  let commentLimit = pageParams.get("commentLimit");
  if(!isValidNumInp(commentLimit) || !commentLimit || commentLimit.length == 0){
    commentLimit = "5"; //reset to some default if malformed input
  }
  //update the text box to display the amount after refresh 
  document.getElementById("commentLimit").value = parseInt(commentLimit);
  return commentLimit;
}

function getSortMethod() {
  var sortMethodOptions = document.getElementById("sortMethod");
  var sortMethod = sortMethodOptions.options[sortMethodOptions.selectedIndex].value;
  //update select menu to reflect what has been chosen
  document.getElementById("sortMethod").value = sortMethod;

  return sortMethod;
}

function applySortMethod() {
  addMessage(0, getSortMethod());
}

addMessage();
pagination();