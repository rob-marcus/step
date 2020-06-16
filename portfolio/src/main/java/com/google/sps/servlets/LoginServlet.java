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


import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.google.sps.data.UserInfo;

@WebServlet("/check-login")
public class LoginServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    
    UserInfo userInfo = new UserInfo();
    UserService userService = UserServiceFactory.getUserService();

    //if logged in prepare log out response and such; else the opposite
    if (userService.isUserLoggedIn()) {
      String userEmail = userService.getCurrentUser().getEmail();
      String urlToRedirectToAfterUserLogsOut = "/index.html";
      String logoutUrl = userService.createLogoutURL(urlToRedirectToAfterUserLogsOut);
      
      userInfo.loggedIn = true;
      userInfo.logoutUrl = logoutUrl;
      userInfo.email = userEmail;
      userInfo.userId = userService.getCurrentUser().getUserId();
  
    } else {
      String urlToRedirectToAfterUserLogsIn = "/index.html";
      String loginUrl = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);
      userInfo.loggedIn = false;
      userInfo.loginUrl = loginUrl;
    }
    //GSON html-escapes by default so have to use this to bypass... 
    Gson gson = new GsonBuilder().disableHtmlEscaping().create();
    String json = gson.toJson(userInfo);
    response.getWriter().println(json);
  }
}