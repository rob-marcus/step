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

const TILES = {"hiking":8, "me":9, "projects":14, "travel":8};


/** 
 * Load a random pic for a specific splash page icon
 */
function randomPic(filePrefix, numFiles, elId) {
  var picOptions = makeFileArray(filePrefix, numFiles); //create arr of options
  randInd = Math.floor((Math.random() * picOptions.length));

  document.getElementById(elId).src = picOptions[randInd];
}

/** 
 * makes an array where arr[i] = filePrefix_i.jpeg
 */
function makeFileArray(filePrefix,numFiles) {
  var arr = new Array(numFiles);
  for(var i = 0; i < numFiles; i++) {
    arr[i] = filePrefix + "_" + (i+1) + ".jpeg"; //files are 1-indexd
  }
  return arr;
}

/** 
 * Map a relevant randomPic to each splash page tiles
 */
function randomPics() {
  for (tileName in TILES) {
    var filePrefix = `images/${tileName}_images/${tileName}`;
    var numFiles = TILES[tileName];
    var elId = tileName + "-rand-pic";
    randomPic(filePrefix, numFiles, elId);
  }
}


window.onload = randomPics();
