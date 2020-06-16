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
import com.google.appengine.api.datastore.QueryResultList;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import com.google.sps.data.Comment;
import com.google.sps.data.UserInfo;

import org.apache.commons.lang3.BooleanUtils; 


@WebServlet("/data")
public class DataServlet extends HttpServlet {
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    int defaultCommentLimit = 5;
    int commentLimit = getPositiveInputOrDefault(request, "commentLimit", defaultCommentLimit);

    int defaultPageNumber = 0;
    int pageNumber = getIntInputOrDefault(request, "pageNumber", defaultPageNumber);
    
    String defaultSortFeature = "timestamp";
    String sortFeature = getSortFeature(request, "sortFeature"); 

    Boolean sortDescending = getBoolInputOrDefault(request, "sortDirection", true);
    
    Query query = new Query("Comment");

    if (sortDescending) {
      query.addSort(sortFeature, SortDirection.DESCENDING);
    } else {
      query.addSort(sortFeature, SortDirection.ASCENDING);
    }
    
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    int startingIndex = pageNumber * commentLimit;

    List<Entity> resultsList = datastore.prepare(query)
                                        .asList(FetchOptions.Builder
                                        .withLimit(startingIndex + commentLimit));

    int endingIndex = Math.min(startingIndex + commentLimit, resultsList.size());

    List<Comment> comments = new ArrayList<>();

    for (int currIndex = startingIndex; currIndex < endingIndex; currIndex++) {
      Entity entity = resultsList.get(currIndex);
      long id = entity.getKey().getId();
      String comment = (String) entity.getProperty("comment");
      long timestamp = (long) entity.getProperty("timestamp");
      long upvoteCount = (long) entity.getProperty("upvoteCount");
      String emailPrefix = (String) entity.getProperty("emailPrefix");
      String userId = (String) entity.getProperty("userId");
      
      Comment newComment = new Comment(id, comment, timestamp, upvoteCount, emailPrefix, userId);
      comments.add(newComment);
    }

    String convertedJSON = new Gson().toJson(comments);
    
    response.setContentType("applications/json;");
    response.getWriter().println(convertedJSON);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    try {
      UserService userService = UserServiceFactory.getUserService();
      if (userService.isUserLoggedIn()) {
        String comment = getParameterOrDefault(request, "comment", /*default comment value=*/"");
        long timestamp = System.currentTimeMillis();
        
        String[] email = userService.getCurrentUser().toString().split("@");
        String emailPrefix = email[0];

        String userId = userService.getCurrentUser().getUserId();

        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("comment", comment);
        commentEntity.setProperty("timestamp", timestamp);
        commentEntity.setProperty("upvoteCount", Long.valueOf(1));
        commentEntity.setProperty("emailPrefix", emailPrefix);
        commentEntity.setProperty("userId", userId);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(commentEntity);

        response.sendRedirect("/index.html");
      } else {
        String urlToRedirectToAfterUserLogsIn = "index.html";
        String loginUrl = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);
        
        response.sendRedirect(loginUrl);
      }
    } catch (Exception e) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND, 
          "Something weird happened with the java data servlet! Oops");
    }
  }

  /*
   * Get corresponding parameter value or return default if not present.
   */
  private String getParameterOrDefault(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
  /*
   * Only return a valid sortFeature...
   */ 
  private String getSortFeature(HttpServletRequest request, String name) {
    String sortFeatureOne = "timestamp";
    String sortFeatureTwo = "upvoteCount";

    String sortFeature = getParameterOrDefault(request, name, sortFeatureOne);
    if (sortFeature.equals(sortFeatureOne) || sortFeature.equals(sortFeatureTwo)) {
      return sortFeature;
    } else {
      return sortFeatureOne;
    }
  }

  /*
   * Return a strictly positive integer from a url parameter, or defaultValue if not present
   * If defaultValue and the requested value are not positive, 1 will be returned. 
   */
  private int getPositiveInputOrDefault(HttpServletRequest request, String name, int defaultValue) {
    int value = getIntInputOrDefault(request, name, defaultValue);
    if (value < 1) {
      //additional guarantee that defaultValue is also positive...
      return defaultValue > 0 ? defaultValue : 1;
    }
    return value;
  }

  /*
   * Return an integer in the url parameter, or defaultValue if not present
   */ 
  private int getIntInputOrDefault(HttpServletRequest request, String name, int defaultValue) {
    try {
      int inputValue = Integer.parseInt(getParameterOrDefault(request, name, 
                            Integer.toString(defaultValue)));
      return inputValue;
    } catch (NumberFormatException nfe) {
      return defaultValue;
    }
  }


  /* 
   * Returns a boolean in the url parameter, or defaultValue if not present
   */
  private Boolean getBoolInputOrDefault(HttpServletRequest request, String name, Boolean defaultValue) {
    Boolean sortDescending = BooleanUtils.toBooleanObject(getParameterOrDefault(request, name, 
                                  Boolean.toString(defaultValue)));
    if (sortDescending == null) {
      return defaultValue;
    }
    return sortDescending;
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

