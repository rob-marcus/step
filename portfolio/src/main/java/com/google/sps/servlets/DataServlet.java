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
    int commentLimit = getIntInpOrDefault(request, "commentLimit", defaultCommentLimit);

    String defaultPageNumber = "0";
    int pageNumber = getIntInpOrDefault(request, "pageNumber", defaultPageNumber);

    String defaultSortMethod = "true";
    String sortMethod = getParameterOrDefault(request, "sortMethod", defaultSortMethod);

    Query query = new Query("Comment");
    
    if (Boolean.parseBoolean(sortMethod)) {
      query.addSort("timestamp", SortDirection.DESCENDING);
    } else {
      query.addSort("timestamp", SortDirection.ASCENDING);
    }
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    

    ArrayList<Comment> comments = new ArrayList<>();

    int startingIndex = pageNumber * commentLimit;
    int count = 0;

    for (Entity entity : results.asIterable()) {
      if (count >= startingIndex) {
        long id = entity.getKey().getId();
        String comment = (String) entity.getProperty("comment");
        long timestamp = (long) entity.getProperty("timestamp");

        Comment newComment = new Comment(id, comment, timestamp);
        comments.add(newComment);
      }
      count++;
      if(count == startingIndex + commentLimit) {
        break;
      }
    }

    String convertedJSON = new Gson().toJson(comments);
    
    response.setContentType("applications/json;");
    response.getWriter().println(convertedJSON);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = getParameterOrDefault(request, "comment", /*default comment value=*/"");
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
  private String getParameterOrDefault(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  private int getIntInpOrDefault(HttpServletRequest request, String name, String defaultValue) {
    try {
      int inpValue = Integer.parseInt(getParameterOrDefault(request, name, defaultValue));
      return inpValue;
    } catch (NumberFormatException nfe) {
      return Integer.parseInt(defaultValue);
    }
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

