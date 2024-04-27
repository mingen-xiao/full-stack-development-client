import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("https://full-stack-development-mingen-e00e505197b4.herokuapp.com/auth/login", data).then((response) => {
      if (response.data.error) {
        // Make some validation middleware to the request and check if the user has a correct "jwt" stored in their local/session storage
        alert(response.data.error); // If theres error in the data, return "Alert"
      } else {
        localStorage.setItem("accessToken", response.data.token); // Set the token and value of data into the "Application" in console.log
        // Changing a STATE to let system know
        // and automatically updated logged in username & id to the database and show immediately on the website
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;
