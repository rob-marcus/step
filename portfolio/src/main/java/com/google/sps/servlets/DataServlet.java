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
import com.google.appengine.api.datastore.FetchOptions;

import com.google.sps.data.Comment;


@WebServlet("/data")
public class DataServlet extends HttpServlet {
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String defaultCommentLimit = "5";
    int commentLimit = Integer.parseInt(getParameter(request, "numShown", defaultCommentLimit));

    String defaultPageNumber = "0";
    int pageNumber = Integer.parseInt(getParameter(request, "pageNumber", defaultPageNumber));
    System.out.println("looks like page number is " + pageNumber);


    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    

    ArrayList<Comment> comments = new ArrayList<>();

    int startingIndex = pageNumber * commentLimit;
    int count = 0;
    System.out.println("");
    System.out.println("Currently on page number" + pageNumber);
    System.out.println("Trying to display " + commentLimit + " comment's per page");
    
    for (Entity entity : results.asIterable()) {
      System.out.println("\tCount is currently " + count);
      if (count >= startingIndex) {
        System.out.println("\t\tAdding a comment to the page");
        long id = entity.getKey().getId();
        String comment = (String) entity.getProperty("comment");
        long timestamp = (long) entity.getProperty("timestamp");
        System.out.println("\t\tLooks like the comment we want to add is " + comment);
        Comment newComment = new Comment(id, comment, timestamp);
        comments.add(newComment);
      }
      count++;
      if(count == startingIndex + commentLimit) {
        System.out.println("\t Breaking because count is at " + count);
        System.out.println("");
        break;
      }
    }

    String convertedJSON = new Gson().toJson(comments);
    
    response.setContentType("applications/json;");
    response.getWriter().println(convertedJSON);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = getParameter(request, "comment", /*default comment value=*/"");
    long timestamp = System.currentTimeMillis();
    
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("timestamp", timestamp);
    
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("/index.html");

  }

  /*
   * Gets page input; lifted from TextProcessorServlet.java example
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  /*
   * Converts a stringArray instance into a JSON string using the Gson library. 
   * Lifted from ServerStatsServlet.java
   */
  private String convertToJsonUsingGson(List<String> stringArray) {
    Gson gson = new Gson();
    String json = gson.toJson(stringArray);
    return json;
  }


}

