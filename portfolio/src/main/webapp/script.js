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
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}


/** Load a random pic for a specific splash page icon
 */
function randomPic(filePrefix, numFiles, elId) {
  console.log("For " + filePrefix + " elId is" + elId);
  var picOptions = makeFileArray(filePrefix, numFiles); //create arr of options
  console.log("picOptions are " + picOptions);
  randInd = Math.floor((Math.random() * picOptions.length));

  document.getElementById(elId).src = picOptions[randInd];
  console.log("for " + elId + " picked image " + picOptions[randInd]);
  console.log("\n");
  return true;
}

/** makes an array where arr[i] = filePrefix_i.jpeg
 */
function makeFileArray(filePrefix,numFiles) {
  var arr = new Array(numFiles);
  for(var i = 0; i < numFiles; i++) {
    arr[i] = filePrefix + "_" + (i+1) + ".jpeg"; //files are 1-indexd
  }
  return arr;
}
/** Map a relevant randomPic to each splash page tiles
 */
function randomPics() {
  const tiles = [["hiking",8],["me",9],["projects",12],["travel",8]];
  const _     = tiles.map(x => randomPic("images/" + x[0] + "_images/"+x[0], x[1], x[0] + "RandPic"));
}

window.onload = randomPics();

