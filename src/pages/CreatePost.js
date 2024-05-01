import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // New state for storing image URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const uploadImage = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name + uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(snapshot.ref);

    setImageUrl(imageUrl);
    alert("Uploaded an image!");
  };

  const postsCollectionRef = collection(db, "posts");

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      date,
      location,
      imageUrl,
      author: {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
    });
    navigate("/");
  };

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div className="inputGp">
          <label>Title: </label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Date: </label>
          <input
            type="date"
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Location: </label>
          <textarea
            placeholder="Location..."
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Post: </label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <button onClick={uploadImage}>Upload Image</button>
        </div>
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
