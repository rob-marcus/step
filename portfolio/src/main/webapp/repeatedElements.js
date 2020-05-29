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


//will build out a generic function to generate this string in future
const LOGOHTML = "<div class='content'> \
                    <div class='container'> \
                      <div class='logo'> \
                        <a href= \
                          'https://linkedin.com/in/robert-marcus-8b443b192'> \
                          <img src='images/linkedin_logo.png'> \
                        </a>\
                        <a href='https://github.com/rob-marcus'> \
                          <img src='images/github_logo.png'>\
                        </a>\
                      </div>\
                    </div>\
                  </div>";

const TILESHTML1 = "<div class='container'>\
                      <div class='container-box'>\
                        <div class='tile'>\
                          <img src=";
const TILESHTML2 = "                >\
                        </div>\
                      </div>\
                      <div class='container-box'>\
                        <div class='tile'>\
                          <img src=";
const TILESHTML3 = "    </div>\
                      </div>\
                    </div>";

const HEADER = "<a href='index.html'> ROB MARCUS </a>";


/**
 * Generate logos at the foot of a doc
 */
function logos() {
  document.getElementById("footer").innerHTML = LOGOHTML;
}
/**
 * Generate header at top of doc
 */
function header() {
  document.getElementById("header").innerHTML = HEADER;
}

/**
 * Generate file path for some imgPrefix_i at index i in imgPrefix_images
 */
function generateImgPath(imgPrefix, tileIndex) {
  return `images/${imgPrefix}_images/${imgPrefix}_${tileIndex}.jpeg`;
}

/**
 * Generate a flexbox with two image-populated tiles in it
 * Prefix is some x \in [me, projects, travel, hiking]
 * i.e., twoTiles("me", 1, 2, "tiles1");
 */
function twoTiles(imgPrefix, tile1Index, tile2Index, elId) {
  var tile1Path = generateImgPath(imgPrefix, tile1Index);
  var tile2Path = generateImgPath(imgPrefix, tile2Index);
  //combine html
  var twoTilesHTML = TILESHTML1 + tile1Path + TILESHTML2 + tile2Path + TILESHTML3;
  console.log(twoTilesHTML);
  console.log(tile1Path, tile2Path)
  document.getElementById(elId).innerHTML = twoTilesHTML;
}

/**
 * Generate a flexbox for every set of two tiles
 */
function allTwoTiles(prefix, tilesJSON) {
  for (x in TILES) {
    twoTiles(prefix, TILES[x][0], TILES[x][1], x);
  }
}


window.onload = logos();
window.onload = header();
