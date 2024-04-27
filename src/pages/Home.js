import React, { useContext } from "react";
// To make API Requests:
//  1. Use 'fetch api (already comes with JavaScript)'
//  2. Install library 'axios'
import axios from "axios";
import { useEffect, useState } from "react";
// "useNavigate": A hook to allow to navigate & redirect current route to other routes throughout the application
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  // "useState": A list containing all the posts that received from the API request
  const [listOfPosts, setListOfPosts] = useState([]); // Set an array because the API request returns a list
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  // Use "useNavigate()" to navigate & redirect current route to other routes
  let navigate = useNavigate();

  // "useEffect": To fetch all the lists of posts
  useEffect(() => {
    // When refresh the page, it makes a request to ask if status is "false", will redirect to HOME page
    // which cause rerender the page at the same time, so cannot use (!authState.status),
    // but validate by checking the "accessToken" from "localStorage"
    if (!localStorage.getItem("accessToken")) {
      // If not logged in, redirect to "login" page when open "home" page
      navigate("/login");
    } else {
      // else, show everything as usual in "home" page
      // Promise: run an anonymous function after receiving the data
      //  asynchronously, wait for the request to be done
      //  run the 'then' function inside, data received should be stored over here
      axios
        .get("https://full-stack-development-mingen-e00e505197b4.herokuapp.com/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          // Set the list of posts = the response data from the API request
          setListOfPosts(response.data.listOfPosts); // To display data received into the application
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []); // "[]": pass this dependency array so that it wont make the same API request every second
  // Because "useEffect" will run when theres a change in the state of application or each state you put over here

  const likeAPost = (postId) => {
    axios
      .post(
        "https://full-stack-development-mingen-e00e505197b4.herokuapp.com/likes",
        { PostId: postId },
        // Parsing the "Token" as part of the "Header" to "Validate" in the back end
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        // Update an object inside of the list and re-render the page
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                // copy the current existing array
                const likesArray = post.Likes;
                // "pop": remove the last element in an array
                likesArray.pop();
                // Unlike the post
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        // To update the colour changed of the LIKE button immediately with no need to refreshing
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            // "filter": onlt filt by the id and return it to not equal to postId (means UNLIKE the post)
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          // means LIKE the post
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
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
                {/* "Link": Redirect to the "User Profile" when clicking the user name of the Posts */}
                {/* "onClick": Makes each post will have different instance of the function parsing the argument "id" */}
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                {/* Show the length value of the array storing and counting likes */}
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
