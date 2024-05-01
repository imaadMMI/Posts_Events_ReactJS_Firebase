import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  db,
  auth,
} from "../firebase-config"; // Import auth from firebase-config

function EventAnalytics() {
  const [events, setEvents] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRsvpBox, setShowRsvpBox] = useState(false); // State for RSVP box visibility
  const [rsvpUsers, setRsvpUsers] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) return; // If user is not authenticated, return early

      const querySnapshot = await getDocs(collection(db, "posts"));
      const eventList = [];

      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const postId = doc.id;
        if (postId && data.title && data.author?.id === user.uid) {
          const rsvps = data.rsvps || [];
          const rsvpNames = await getRsvpNames(postId);

          eventList.push({
            id: postId,
            title: data.title,
            rsvpCount: data.rsvpCount || 0,
            rsvpNames: rsvpNames,
          });
        }
      });

      setEvents(eventList);
    };

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      fetchEvents(); // Call fetchEvents whenever there's a change in the 'posts' collection
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
  }, []);

  const getRsvpNames = async (postId) => {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("postId", "==", postId)
    );
    const notificationSnapshot = await getDocs(notificationsQuery);
    const rsvpNames = notificationSnapshot.docs.map((doc) =>
      extractUserNameFromMessage(doc.data().message)
    );
    return rsvpNames;
  };

  const extractUserNameFromMessage = (message) => {
    const splitMessage = message.split(" ");
    return splitMessage[0];
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleShowRSVPs = (rsvpNames) => {
    setRsvpUsers(rsvpNames);
    setShowRsvpBox(true); // Show RSVP box when RSVPs are displayed
  };

  const handleCloseRsvpBox = () => {
    setShowRsvpBox(false); // Close RSVP box
  };

  return (
    <div className="event-analytics-container">
      <button className="toggle-analytics-button" onClick={handleShowAnalytics}>
        {showAnalytics ? "Hide Event Analytics" : "Show Event Analytics"}
      </button>
      {showAnalytics && (
        <div className="event-analytics">
          <h2>Event Analytics</h2>
          {events.map((event) => (
            <div key={event.id} className="event-analytics-item">
              <h3>{event.title}</h3>
              <p>Attendees: {event.rsvpCount}</p>
              <button onClick={() => handleShowRSVPs(event.rsvpNames)}>
                Show RSVPs
              </button>
            </div>
          ))}
        </div>
      )}
      {showRsvpBox && (
        <div className="rsvp-users-container">
          <button onClick={handleCloseRsvpBox}>Close</button>
          <h2>RSVPed Users:</h2>
          <ul>
            {rsvpUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventAnalytics;
