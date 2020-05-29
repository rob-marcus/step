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

/** Load a random pic for a specific splash page icon
 */
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



window.onload = logos();
window.onload = header();