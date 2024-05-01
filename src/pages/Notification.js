/* Notification.js */

import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);

  const notificationsCollectionRef = collection(db, "notifications");

  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(notificationsCollectionRef);
      const userNotifications = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          userNotifications.push({ id: doc.id, message: data.message });
        }
      });

      setNotifications(userNotifications);
    };

    fetchNotifications();
  }, [userId, notificationsCollectionRef]);

  const handleClearNotifications = async () => {
    // Clear notifications for the user in the database
    const userNotifications = notifications.map((notification) =>
      doc(db, "notifications", notification.id)
    );
    await Promise.all(
      userNotifications.map((notification) => deleteDoc(notification))
    );

    // Clear notifications in the component state
    setNotifications([]);
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <button onClick={handleClearNotifications}>Clear Notifications</button>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;
