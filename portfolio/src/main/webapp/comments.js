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
  var numShown = getCommentLimit();
  (fetch('/num-comments').then(response => response.text()).then(numComments =>
  {
    var numPages = Math.ceil(numComments/numShown);
    var paginationDiv = document.getElementById("pagination");
    for (var pageNumber = 0; pageNumber < numPages; pageNumber++) {
      const thisPageNumber = pageNumber;

      var pageElement = document.createElement("a");
      pageElement.innerText = thisPageNumber;
      pageElement.href = "#";
      pageElement.addEventListener('click', () => {
        //load comments on pageNumber
        addMessage(thisPageNumber, getSortMethod);
      });

      paginationDiv.appendChild(pageElement);
    }
  }));
}


/**
 * Using fetch request content from servlet and add to home page
 */
function addMessage(pageNumber = 0, sortMethod = {"feature": "timestamp", 
                                                  "direction": "DESCENDING"})
{
  /**
   * GET does not support additional URL params in the body
   * So...
   * A novel hack around this (rather than rewrite the GET logic)
   * Is to just manually add the strings into the fetch url
   * This 'works' because the java function getParameter 
   * Will still parse a manually constructed URL string
   * So...
   */
  const numShown = getCommentLimit();
  clearMessageDiv();
  const url = [`/data?pageNumber=${pageNumber}`,
              `&numShown=${numShown}`,
              `&sortFeature=${sortMethod.feature}`,
              `&sortDirection=${sortMethod.direction}`].join("");

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
  messageDiv.className = "message-box";
  var commentElement = document.createElement("p");
  commentElement.innerText = `${Comment.comment} posted at ${Comment.timestamp}`;

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.innerText = "Delete comment";
  deleteButtonElement.addEventListener('click', () => {
    //remove from datastore and DOM
    deleteComment(Comment);
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

function deleteComment(Comment) {
  const params = new URLSearchParams();
  params.append('id', Comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}

function upvoteComment(Comment) {
  const params = new URLSearchParams(); 
  params.append('id', Comment.id);
  params.append('upvotes', Comment.upvotes + 1)
  params.append('comment', Comment.comment);
  params.append('timestamp', Comment.timestamp)
  fetch("/upvote-comment", {method: 'POST', body: params});
}

function getCommentLimit() {
  let tmp = (new URL(document.location)).searchParams;
  let res = tmp.get("numShown");
  if(!res || res.length == 0){
    res = "5";
  }
  //update the text box to display the amount after refresh 
  document.getElementById("numShown").value = parseInt(res);
  return res;
}

function getSortMethod() {
  var sortMethodOptions = document.getElementById("sortMethod");
  var sortMethod = sortMethodOptions.options[sortMethodOptions.selectedIndex].value;
  document.getElementById("sortMethod").value = sortMethod;
  var splitSortMethod = sortMethod.split(" ");

  return {"feature": splitSortMethod[0], "direction": splitSortMethod[1]};
}

function applySortMethod() {
  addMessage(0, getSortMethod());
}

addMessage();
pagination();