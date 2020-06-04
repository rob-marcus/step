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

const TILES = {"travel": 8, "projects": 14, "me": 9, "hiking": 8};

/**
 * return a random img with index i from the proper subdirectory
 */
function randomImg(tileName) {
  var randInd = Math.floor((Math.random() * TILES[tileName]));
  var path = `images/${tileName}_images/${tileName}_${randInd}.jpeg`;

  return path;
}

/**
 * For a given tileName, generate all the requisite elements
 * There is probably a more CLEAR way to write all of this...
 * so much appending ahhhhh
 */
function generateInteractiveTile(tileName) {
  var containerBoxDiv = document.createElement("div");
  var textBoxDiv = document.createElement("div");
  
  containerBoxDiv.className = "container-box";
  textBoxDiv.className = "text-box";
  
  var textBoxText = document.createTextNode(tileName.toUpperCase());
  textBoxDiv.appendChild(textBoxText);

  var tileDiv = document.createElement("div");
  var interactiveTileDiv = document.createElement("div");
  var pageLinkDiv = document.createElement("a");
  var randImgDiv = document.createElement("img");

  tileDiv.className = "tile";
  interactiveTileDiv.className = "interactive-tile";
  
  pageLinkDiv.href = `${tileName}.html`;
  randImgDiv.src = randomImg(tileName);

  pageLinkDiv.appendChild(randImgDiv);
  
  interactiveTileDiv.appendChild(textBoxDiv);
  interactiveTileDiv.appendChild(pageLinkDiv);

  tileDiv.appendChild(interactiveTileDiv);
  containerBoxDiv.appendChild(tileDiv);

  return containerBoxDiv;
}

/**
 * for every tile key in TILES, generate an interactive and random tile
 */
function interactiveTiles() {
  var contentDiv = document.createElement("div");
  var splashContentDiv = document.createElement("div");
  var containerDiv = document.createElement("div");
  
  contentDiv.className = "content";
  splashContentDiv.className = "splash-content";
  containerDiv.className = "container";

  contentDiv.appendChild(splashContentDiv);
  splashContentDiv.appendChild(containerDiv);

  for (var tile in TILES) {
    var containerBoxDiv = generateInteractiveTile(tile);
    containerDiv.appendChild(containerBoxDiv);
  }
  document.getElementById("splash-tiles").appendChild(contentDiv);
}


interactiveTiles();



/**
 * Week 3 dev stuff
 * Using fetch request content from servlet and add to home page
 */
function addMessage() {
  const numShown = getCommentLimit();

  document.getElementById("numShown").value = parseInt(numShown);
  fetch('/data?numShown='+numShown).then(response => response.json()).then((quote) => {
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

function getCommentLimit() {
  let tmp = (new URL(document.location)).searchParams;
  let res = tmp.get("numShown");
  if(!res || res.length == 0){
    return "5";
  }
  return res;
}

addMessage();
