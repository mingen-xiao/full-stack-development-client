/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
// A hook to get the params
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams(); // To get the params, which is the (id)
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  // To fetch the data base on the ID
  useEffect(() => {
    axios.get(`https://full-stack-development-mingen-e00e505197b4.herokuapp.com/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`https://full-stack-development-mingen-e00e505197b4.herokuapp.com/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []); // "[]": pass this dependency array so that it wont make the same API request every second
  // Because "useEffect" will run when theres a change in the state of application or each state you put over here

  const addComment = () => {
    axios
      .post(
        "https://full-stack-development-mingen-e00e505197b4.herokuapp.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), // "accessToken": in AuthMiddleware.js file
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // If need to assume the data has been automatically added to the database with the corresponding username
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          }; // Since each comment is an "Object" containing "postId" & "commentBody", and we only care "commentBody"
          setComments([...comments, commentToAdd]); // Format: Array destructuring (Grab the content in the first index of the array and put into the second index)
          setNewComment(""); // To set the comment into an empty String after adding it, in order to clear the text bar
        }
      });
  };

  const deleteComment = (id) => {
    // "headers": passed by the "localStorage"
    axios
      .delete(`https://full-stack-development-mingen-e00e505197b4.herokuapp.com/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // Filtering the "comments" list and remove the item that deleted
        // In order to refresh the web page automatically
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://full-stack-development-mingen-e00e505197b4.herokuapp.com/posts/${id}`, {
        // Pass the "accessToken" as part of the "headers" in this request to update changes in the front-end
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // When deleted, automatically redirect to the HOME page
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      // No matter what enterred when clicked title, stored in this
      let newTitle = prompt("Enter New Title: ");
      axios.put(
        "https://full-stack-development-mingen-e00e505197b4.herokuapp.com/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Automatically "refresh" the page when changed: Reamin everything same but the "title"
      setPostObject({ ...postObject, title: newTitle });
    } else {
      // No matter what enterred when clicked text, stored in this
      let newPostText = prompt("Enter New Text: ");
      axios.put(
        "https://full-stack-development-mingen-e00e505197b4.herokuapp.com/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Automatically "refresh" the page when changed: Reamin everything same but the "postText"
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              // Will not execute if user not logged in or not the editable user
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              editPost("body");
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {/* check if the "username" for the post and for the user logged in is the same, to decide show delete button or not */}
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          {/* "event.target.value": A way in React to grab "values" directly from "inputs" and set them to a "state" and use later */}
          <input
            type="text"
            placeholder="Comment..."
            value={newComment} // To set the comment into an empty String after adding it, in order to clear the text bar
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                {/* Show the username after the comments */}
                <label>Username: {comment.username}</label>
                {/* Only shows the "delete" button for those comments that written by the current logged in username */}
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
