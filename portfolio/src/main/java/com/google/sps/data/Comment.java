 
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

package com.google.sps.data;

/**
 * Comment class structure
 * id is ascribed by datastore KeyFactory, not manually generated...
 */
public final class Comment {
  private final long id;
  private final String comment;
  private final long timestamp;
  private final long upvoteCount; 

  public Comment(long id, String comment, long timestamp, long upvoteCount) {

    this.id = id;
    this.comment = comment;
    this.timestamp = timestamp;
    this.upvoteCount = upvoteCount; 
    this.userName = userName;
    this.userId = userId;
  }
}