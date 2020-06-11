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

// TODO: rewrite header/footer to use insertBefore and insertAfter
// TODO: so I don't have to call footer and header in each new page...
// TODO: will come back to later; a little too much rn

const LOGOS = {"linkedin": 
                    {"dest": "https://linkedin.com/in/robert-marcus-8b443b192",
                     "src": "images/linkedin_logo.png"},
                "github": 
                    {"dest": "https://github.com/rob-marcus",
                     "src": "images/github_logo.png"}
                  };

const HEADER_TITLE = "ROB MARCUS";


/**
 * For a given logo, create the requisite html objects
 */
function generateLogo(logoInfo) {
  logoLink = document.createElement("a");
  logoImg = document.createElement("img");

  logoLink.href = logoInfo.dest;
  logoImg.src = logoInfo.src;

  logoLink.appendChild(logoImg);
  
  return logoLink
}

/**
 * Generate all logos as JS objects
 */
function generateLogos() {
  var contentDiv = document.createElement("div");
  var containerDiv = document.createElement("div");
  var logoDiv = document.createElement("div");

  contentDiv.className = "content";
  containerDiv.className = "container";
  logoDiv.className = "logo";

  containerDiv.appendChild(logoDiv);
  contentDiv.appendChild(containerDiv);

  for (logo in LOGOS) {
    logoDiv.appendChild(generateLogo(LOGOS[logo]));
  }

  document.getElementById("footer").appendChild(contentDiv);
}


/**
 * If subTitle is the empty string keep it
 * Else format as "x CAPS(subTitle)"
 */
function formatSubtitle(subTitle) { 
  return (subTitle === "" ? "" : `x ${subTitle.toUpperCase()}`);
}

/**
 * Generate header at top of doc
 * This time with objs instead of basic strings
 */
function header(subTitle = "") { 
  var headerDiv = document.createElement("h1");
  var headerLinkDiv = document.createElement("a");
  var subTitleDiv = document.createElement("p");

  headerLinkDiv.href = "index.html";
  
  var headerTitle = document.createTextNode(HEADER_TITLE);
  var subTitle = document.createTextNode(formatSubtitle(subTitle));
  
  subTitleDiv.appendChild(subTitle);
  headerLinkDiv.appendChild(headerTitle);

  headerDiv.appendChild(headerLinkDiv);
  headerDiv.appendChild(subTitleDiv);

  document.getElementById("header").appendChild(headerDiv);
}


/**
 * Generate file path for some imgPrefix_i at index i in imgPrefix_images
 */
function generateImgPath(imgPrefix, tileIndex) {
  return `images/${imgPrefix}_images/${imgPrefix}_${tileIndex}.jpeg`;
}


/**
 * generate the HTML for an img at path imgPath
 */
function generateTile(tilePath) {
  var containerBoxDiv = document.createElement("div");
  var tileDiv = document.createElement("div");
  var imgDiv = document.createElement("img");

  containerBoxDiv.classname = "container-box";
  tileDiv.className = "tile"
  imgDiv.src = tilePath;

  tileDiv.appendChild(imgDiv);
  containerBoxDiv.appendChild(tileDiv);
  
  return containerBoxDiv;
}


/**
 * Generate a flexbox with arbitarily many 
 * image-populated tiles in it
 * Prefix is some x \in [me, projects, travel, hiking]
 * i.e., twoTiles("me", 1, 2, "tiles1");
 */
function generateTiles(imgPrefix, tileIndexs, elId) {
  const tilesDiv = document.createElement("div");
  tilesDiv.className = "container";

  for (var i = 0; i < tileIndexs.length; i++) {
    const tileIPath = generateImgPath(imgPrefix, tileIndexs[i]); 
    tilesDiv.appendChild(generateTile(tileIPath));
  }
  document.getElementById(elId).appendChild(tilesDiv);
}

/**
 * Generate a flexbox for every set of tiles
 */
function generateAllTiles(prefix, tilesJson) {
  for (tile in tilesJson) {
    generateTiles(prefix, tilesJSON[tile], tile);
  }
}

window.onload = generateLogos();
