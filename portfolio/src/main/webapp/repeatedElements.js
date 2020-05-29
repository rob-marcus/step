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
                          'https://linkedin.com/in/robert-marcus-8b443b192'\
                          target='_blank'> \
                          <img src='images/linkedin_logo.png'> \
                        </a>\
                        <a href='https://github.com/rob-marcus'\
                          target='_blank'> \
                          <img src='images/github_logo.png'>\
                        </a>\
                      </div>\
                    </div>\
                  </div>";
                  
/**
 * Generate logos at the foot of a doc
 */
function logos() {
  document.getElementById("footer").innerHTML = LOGOHTML;
}

/**
 * Generate header at top of doc
 */
function header(inpString) {
  var basicHeader = "<h1><a href='index.html'> ROB MARCUS </a>";

  if(inpString !== undefined) {
    basicHeader += `<p> x ${inpString} </p>`
  }
  
  document.getElementById("header").innerHTML = basicHeader + "</h1>";

}

/**
 * generate the HTML for an img at path imgPath
 */
function generateTile(imgPath) {
  const reduceString = (accum, currString) => accum + currString;

  var tileHTML = ["<div class='container-box'>\
                      <div class='tile'>\
                        <img src=",
                  imgPath,
                  "     >\
                      </div>\
                    </div>\
                  "];

  return tileHTML.reduce(reduceString);
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
function nTiles(imgPrefix, tileIndexs, elId) {
  var tilesHTML = "<div class='container'>";
  for (var i = 0; i < tileIndexs.length; i++) {
    tileIPath = generateImgPath(imgPrefix, tileIndexs[i]); //1-indexd
    tilesHTML += generateTile(tileIPath); 
  }
  tilesHTML += "</div>";
  document.getElementById(elId).innerHTML = tilesHTML;
}

/**
 * Generate a flexbox for every set of tiles
 */
function allTileBoxs(prefix, tilesJSON) {
  for (x in TILES) {
    nTiles(prefix, TILES[x], x);
  }
}


window.onload = logos();
