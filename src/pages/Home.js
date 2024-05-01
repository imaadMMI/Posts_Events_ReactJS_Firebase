import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import Notification from "./Notification";
import EventAnalytics from "./EventAnalytics";
import "../App.css";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({
    id: "",
    title: "",
    postText: "",
    dateFrom: "",
    dateTo: "",
    location: "",
    category: "",
  });
  const [rsvpNotifications, setRsvpNotifications] = useState({});
  const [rsvpStatus, setRsvpStatus] = useState({});

  const postsCollectionRef = collection(db, "posts");
  const notificationsCollectionRef = collection(db, "notifications");
  const navigate = useNavigate();

  const rsvpAlert = (post) => {
    const user = auth.currentUser;

    if (rsvpStatus[post.id]) {
      cancelRSVP(post);
    } else {
      addRSVP(post);
    }
  };

  const addRSVP = async (post) => {
    const user = auth.currentUser;
    const postId = post.id;

    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, {
      rsvpCount: post.rsvpCount ? post.rsvpCount + 1 : 1,
      rsvps: arrayUnion(user.uid),
    });

    const notificationMessage = `${user.displayName} RSVPed to your event: ${post.title}`;
    await addDoc(notificationsCollectionRef, {
      userId: post.author.id,
      postId: postId,
      message: notificationMessage,
    });

    // Update RSVP status in local storage
    const updatedRsvpStatus = { ...rsvpStatus, [postId]: true };
    setRsvpStatus(updatedRsvpStatus);
    localStorage.setItem("rsvpStatus", JSON.stringify(updatedRsvpStatus));

    alert("RSVPed!");
    getFilteredPosts();
  };

  const cancelRSVP = async (post) => {
    const user = auth.currentUser;
    const postId = post.id;

    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, {
      rsvpCount: post.rsvpCount ? post.rsvpCount - 1 : 0,
      rsvps: arrayRemove(user.uid),
    });

    const notificationQuery = query(
      notificationsCollectionRef,
      where("userId", "==", post.author.id),
      where("postId", "==", postId)
    );
    const notificationSnapshot = await getDocs(notificationQuery);
    notificationSnapshot.forEach(async (notification) => {
      await deleteDoc(doc(db, "notifications", notification.id));
    });

    // Update RSVP status in local storage
    const updatedRsvpStatus = { ...rsvpStatus, [postId]: false };
    setRsvpStatus(updatedRsvpStatus);
    localStorage.setItem("rsvpStatus", JSON.stringify(updatedRsvpStatus));

    alert("RSVP Cancelled!");
    getFilteredPosts();
  };

  const getFilteredPosts = async () => {
    let filteredPosts = [];

    if (selectedCategory) {
      const q = query(
        postsCollectionRef,
        where("category", "==", selectedCategory)
      );
      const querySnapshot = await getDocs(q);
      filteredPosts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      const querySnapshot = await getDocs(postsCollectionRef);
      filteredPosts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }

    if (searchQuery) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ensure the id field is included
    filteredPosts = filteredPosts.map((post) => ({ ...post, id: post.id }));

    setPostList(filteredPosts);
  };

  useEffect(() => {
    getFilteredPosts();
    const unsubscribe = onSnapshot(postsCollectionRef, () => {
      getFilteredPosts();
    });

    return () => unsubscribe();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const unsubscribeRsvps = onSnapshot(postsCollectionRef, (snapshot) => {
      const newRsvpNotifications = {};
      snapshot.docs.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;
        const postRsvps = post.rsvps || [];
        newRsvpNotifications[postId] = postRsvps.map(
          (userId) => `${userId} RSVPed to your event: ${post.title}`
        );
      });
      setRsvpNotifications(newRsvpNotifications);
    });

    // Retrieve RSVP status from local storage
    const localStorageRsvpStatus =
      JSON.parse(localStorage.getItem("rsvpStatus")) || {};
    setRsvpStatus(localStorageRsvpStatus);

    return () => unsubscribeRsvps();
  }, []);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    alert("Event Deleted!");
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().displayName;
    } else {
      return "Unknown User";
    }
  };

  const editPost = async () => {
    const postDoc = doc(db, "posts", editedPost.id);
    await updateDoc(postDoc, {
      title: editedPost.title,
      postText: editedPost.postText,
      dateFrom: editedPost.dateFrom,
      dateTo: editedPost.dateTo,
      location: editedPost.location,
      category: editedPost.category,
    });

    setEditMode(false);
    setEditedPost({
      id: "",
      title: "",
      postText: "",
      dateFrom: "",
      dateTo: "",
      location: "",
      category: "",
    });

    getFilteredPosts();
  };

  const handleEditPost = (post) => {
    setEditedPost({ ...post });
    setEditMode(true);
    setButtonPopup(true);
  };

  return (
    <div className="homePage">
      <EventAnalytics />
      <div className="eventsSearchBar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button onClick={() => setButtonPopup(true)}>Create Event</button>
      <div className="notif">
        <button onClick={handleToggleNotifications}>Show Notifications</button>
      </div>
      <Popup
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        editedPost={editedPost}
        setEditedPost={setEditedPost}
        editMode={editMode}
        editPost={editPost}
        setEditMode={setEditMode}
      />

      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All</option>
        <option value="fun">Fun</option>
        <option value="technology">Technology</option>
        <option value="art">Art</option>
        <option value="education">Education</option>
        <option value="gaming">Gaming</option>
        <option value="business">Business</option>
        <option value="general science">General Science</option>
        <option value="maths">Maths</option>
      </select>

      {showNotifications && <Notification userId={auth.currentUser.uid} />}

      {postLists.map((post) => (
        <div className="post" key={post.id}>
          <div className="postHeader">
            <div className="title">
              <h1>{post.title}</h1>
            </div>
            <div className="deletePostButton">
              {isAuth && post.author.id === auth.currentUser.uid && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  Delete Post
                </button>
              )}
            </div>
            <div className="editPostButton">
              {isAuth && post.author.id === auth.currentUser.uid && (
                <button onClick={() => handleEditPost(post)}>Edit Post</button>
              )}
            </div>
          </div>
          <div className="dateFrom">
            <h3>From {post.dateFrom}</h3>
          </div>
          <div className="dateTo">
            <h3> To {post.dateTo}</h3>
          </div>
          <div className="location">
            <h3>At {post.location}</h3>
          </div>
          <div className="postTextContainer">
            <br />
            {post.postText}
          </div>
          <br />
          {post.imageUrl && <img src={post.imageUrl} alt="Post Image" />}
          <div className="postCategory">
            <h2>{post.category}</h2>
          </div>
          <h3>{post.author.name}</h3>
          <button onClick={() => rsvpAlert(post)}>
            {rsvpStatus[post.id] ? "Cancel RSVP" : "RSVP"}
          </button>
          <span>{post.rsvpCount || 0} RSVPs</span>
          <div className="postInfo">
            <p>
              Posted on:{" "}
              {post.timestamp
                ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
