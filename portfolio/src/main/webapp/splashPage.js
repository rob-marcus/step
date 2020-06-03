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
  fetch('/data').then(response => response.json()).then((quote) => {
    quote.forEach(Comment => console.log(Comment.comment + " at time " + Comment.timestamp));
    //document.getElementById('message-container').innerHTML = quote;
    const messageContainerDiv = document.getElementById("message-container");
    quote.forEach(Comment => messageContainerDiv.appendChild(addMessageElements(Comment)));});
}

/**
 * Build the elements of an individual message using JSON data
 * Also create a delete button
 */
function addMessageElements(Comment) {
  var messageDiv = document.createElement("div");

  var commentDiv = document.createElement("p");
  commentDiv.innerText = `${Comment.comment} posted at ${Comment.timestamp}`;

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.innerText = "Delete";
  deleteButtonElement.addEventListener('click', () => {
    //remove from datastore and DOM
    deleteComment(Comment);
    messageDiv.remove();
  });
  
  messageDiv.appendChild(commentDiv);
  messageDiv.appendChild(deleteButtonElement);
  return messageDiv;
}

function deleteComment(Comment) {
  const params = new URLSearchParams();
  params.append('id', Comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}
 window.onload = addMessage();