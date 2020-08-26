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

 
import static org.mockito.Mockito.*;
import static org.junit.Assert.assertTrue;

import javax.servlet.http.*;
import org.junit.Assert;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;

import com.google.sps.data.Comment;
import javax.servlet.http.*;
import java.io.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RunWith(JUnit4.class)
public class NumCommentsTest {

  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Before
  public void setUp() {
    helper.setUp();
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }
  
  /*
   * Helper that simply removes all whitespace and invisible chars (tabs, \n...)
   */
  public String removeWhitespace(String input) {
    return input.replaceAll("\\s+","");
  }

  /*
   * Turn a response StringWriter into an Int
   */
  public int StringWriterToInt(StringWriter stringWriter) {
    String string = stringWriter.toString();
    String withoutWhitespace = removeWhitespace(string);
    try {
      int inputValue = Integer.valueOf(removeWhitespace(string));
      return inputValue;
    } catch (NumberFormatException nfe) {
      throw new NumberFormatException("Couldn't parse " + withoutWhitespace);
    }
  } 

  /*
   * Just make a basic comment entity for testing purposes.
   */
  public Entity basicComment() {
    Entity commentEntity = new Entity("Comment");
    Long oneLong = Long.valueOf(1);

    commentEntity.setProperty("comment", "");
    commentEntity.setProperty("timestamp", oneLong);
    commentEntity.setProperty("upvoteCount", oneLong);
    commentEntity.setProperty("id", oneLong);
    return commentEntity;
  }

  /*
   * 
   */
  public StringWriter getStringWriter(HttpServletResponse response) throws Exception {
    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);
    
    return stringWriter;
  }

  @Test
  public void testEmpty() throws Exception {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    
    HttpServletRequest request = mock(HttpServletRequest.class);       
    HttpServletResponse response = mock(HttpServletResponse.class); 

    StringWriter stringWriter = getStringWriter(response);

    new NumCommentsServlet().doGet(request, response);
    
    int numComments = StringWriterToInt(stringWriter);
    Assert.assertEquals(numComments, 0);
  }

  @Test 
  public void testOneComment() throws Exception {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    
    Entity commentEntity = basicComment();
    ds.put(commentEntity);

    HttpServletRequest request = mock(HttpServletRequest.class);       
    HttpServletResponse response = mock(HttpServletResponse.class); 

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    new NumCommentsServlet().doGet(request, response);
        
    int numComments = StringWriterToInt(stringWriter);
    Assert.assertEquals(numComments, 1);
  }
  
  @Test
  public void testAddedCommentsCounted() throws Exception {    
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

    Entity commentEntity1 = basicComment();
    ds.put(commentEntity1);

    HttpServletRequest request = mock(HttpServletRequest.class);       
    HttpServletResponse response = mock(HttpServletResponse.class); 

    StringWriter stringWriter = getStringWriter(response);

    new NumCommentsServlet().doGet(request, response);
        
    int numComments = StringWriterToInt(stringWriter);
    Assert.assertEquals(numComments, 1);

    //add a second comment and call the servlet again with new inputs
    StringWriter stringWriter2 = getStringWriter(response);

    Entity commentEntity2 = basicComment();
    ds.put(commentEntity2);
    
    new NumCommentsServlet().doGet(request, response);
    int numComments2 = StringWriterToInt(stringWriter2);

    Assert.assertEquals(numComments2, 2);
  }
  
  @Test
  public void testDeletedCommentsNotCounted() throws Exception {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

    Entity commentEntity = basicComment();
    ds.put(commentEntity);

    HttpServletRequest request = mock(HttpServletRequest.class);       
    HttpServletResponse response = mock(HttpServletResponse.class); 

    StringWriter stringWriter1 = getStringWriter(response);

    new NumCommentsServlet().doGet(request, response);
        
    int numComments = StringWriterToInt(stringWriter1);
    Assert.assertEquals(numComments, 1);

    Long id = (Long) commentEntity.getProperty("id");
    Key taskEntityKey = KeyFactory.createKey("Comment", id);
    ds.delete(taskEntityKey); 

    StringWriter stringWriter2 = getStringWriter(response);
    
    new NumCommentsServlet().doGet(request, response);
    int numComments2 = StringWriterToInt(stringWriter2);
    Assert.assertEquals(numComments2, 0);
  }
}