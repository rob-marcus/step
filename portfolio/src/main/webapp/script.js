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

/**
 * Return the current page
 * Doesn't currently work on the maven generated page
 * But should take like www.../page.html
 * and return page.html
 */
function currPage() {
    var page = window.location.pathname;
    var pageName = page.substring(page.lastIndexOf('/') + 1);
    alert(window.location.href)
}

/**
 * Returns a list of pages excluding the current page
 */
function otherPages(currPageIndex) {
  const indexedPages = ["/index.html",
                        "/hiking.html",
                        "/glass.html",
                        "/projects.html",
                        "/about.html",
                        "/contact.html"]
  //if currPageIndex < 0 raise exception...?
  //if currPageIndex > len(indexedPages) 
  //I believe the method is safe and won't throw an error
  //just returns unaltered list, so that's fine(?)
  var prePages  = indexedPages.slice(0, currPageIndex)
  var postPages = indexedPages.slice(currPageIndex + 1, indexedPages.length)
  var preAndPostPages = prePages.concat(postPages)
  
  return preAndPostPages 
}