package com.google.sps;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public final class FindMeetingQuery {
  /*
   * Query initializes relevant collections and returns available times for required/optional
   * Attendees depending on if both/only required can go. Does so \in O(n lg n) time
   * as the helper function getTimes sorts the busy times list in nlogn and iterates through
   * in linear time. Better than n^2 if had compare all possible pairs of meetings.    
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    
    // initialize attendees 
    Collection<String> required = request.getAttendees();
    Collection<String> optional = request.getOptionalAttendees();
    Collection<String> everybody = new HashSet<>();

    everybody.addAll(required);
    everybody.addAll(optional);

    long meetingDuration = request.getDuration();

    Collection<TimeRange> timesForEverybody = getTimes(events, meetingDuration, everybody);

    // timesForEverybody could be empty 
    // i.e., no overlapping times among required and/or optional, so test with just required
    // the result will be the same tho if nobody is required so don't do useless computation
    if (timesForEverybody.isEmpty() && !required.isEmpty()) {
      Collection<TimeRange> timesForRequired = getTimes(events, meetingDuration, required);
      return timesForRequired;
    }

    return timesForEverybody;
  }

  private Collection<TimeRange> getTimes(Collection<Event> events, long meetingDuration, Collection<String> attendees) {
    List<TimeRange> occupiedTimes = new ArrayList<>();
    Collection<TimeRange> freeTimes = new ArrayList<>();

    // Add TimeRange to occupiedTimes iff an attendee is occupied
    for (Event event : events) {
      if (!Collections.disjoint(event.getAttendees(), attendees)) {
        occupiedTimes.add(event.getWhen());
      }
    }

    Collections.sort(occupiedTimes, TimeRange.ORDER_BY_START); 

    // meeting start time, to be updated as meeting times are 'merged' together
    int startTime = TimeRange.START_OF_DAY;   
    int endTime = TimeRange.END_OF_DAY;

    // Merge valid times and get rid of the junk. 
    for (TimeRange time : occupiedTimes) {
      if (time.start() - startTime >= meetingDuration) {
        freeTimes.add(TimeRange.fromStartEnd(startTime, time.start(), false)); 
      }
      startTime = Math.max(startTime, time.end());
    }
    
    // check EOD slipped through. 
    if (endTime - startTime >= meetingDuration) {
      freeTimes.add(TimeRange.fromStartEnd(startTime, endTime, true)); 
    }

    return freeTimes; 
  }
}