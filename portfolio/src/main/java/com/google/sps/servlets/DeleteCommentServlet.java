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


package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.ArrayList;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;


import com.google.sps.data.Comment;
import com.google.sps.data.UserInfo;

/** Servlet responsible for deleting comments. */
@WebServlet("/delete-comment")
public class DeleteCommentServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    long id = Long.parseLong(request.getParameter("id"));
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key taskEntityKey = KeyFactory.createKey("Comment", id);
    
    // Only delete a comment if the author is trying to delete it. 
    try {
      String commentUserId = (String) datastore.get(taskEntityKey).getProperty("userId");

      UserService userService = UserServiceFactory.getUserService();

      if (userService.isUserLoggedIn()) {
        String currentUserId = userService.getCurrentUser().getUserId();
        if(currentUserId.equals(commentUserId)) {
          datastore.delete(taskEntityKey);
          response.setStatus(HttpServletResponse.SC_OK); // success (200)
        } else {
          response.setStatus(HttpServletResponse.SC_FORBIDDEN); // logged in but not author (403)
        }
      } else {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // not logged in (401)
      }
    } catch (com.google.appengine.api.datastore.EntityNotFoundException enfe) {
      System.out.println("Failed to delete " + id + " possibly because it does not exist." + enfe);
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
  }
}