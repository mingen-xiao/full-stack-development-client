import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams(); // "id": equals to whichever number passed in the route(path)
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  //   "useEffect" will act whenever you access the page for the first time
  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    // "response": The "Array" containing all the "posts" we need
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
      {/* Grab the parameters by using the use params hook from react-router-dom */}
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        {/* If "authstate.username" = "username of this profile", display the button, or otherwise */}
        {authState.username === username && (
          <button
            onClick={() => {  // STEP 4
              navigate("/changepassword");
            }}
          >
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          // "map": map all the data in every Post in the List
          return (
            <div key={key} className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  // "navigate()": Navigate & Redirect current route to other routes
                  // "``": Backticks sign allows to add ID
                  // "${}": Allows to add JavaScript Variables
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">
                  {/* "onClick": Makes each post will have different instance of the function parsing the argument "id" */}
                  {value.username}
                </div>
                <div className="buttons">
                  {/* Show the length value of the array storing and counting likes */}
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
