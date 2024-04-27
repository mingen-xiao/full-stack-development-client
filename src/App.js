import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registraion from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
// STEP 2
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  // Keep track whether we are logged in or not
  // Get information including username & id, when validating status
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // Only want to render ONCE when open the page
  // Set AUTH STATE to validate a real login & a fake login
  useEffect(() => {
    axios
      .get("https://full-stack-development-mingen-e00e505197b4.herokuapp.com/auth/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          // Grabbing the whole auth state, but just need to change one state called "status", into false
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  });

  const logout = () => {
    // "removeItem": to remove the item in the localStorage with the keyword "accessToken", which is the user acc
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    // Redirect to the login page when logged out
    navigate("/login");
  };

  return (
    <div className="App">
      {/* "Provider": means context provider */}
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="navbar">
          <div className="links">
            {/* Since the STATE has changed in Login.js setAuthState(true),  */}
            {/* it knows it's logged in & no need to display the Login & Registration buttons */}
            {!authState.status ? ( // Shows buttons separately BEFORE and AFTER "login"
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registraion</Link>
              </>
            ) : (
              <>
                <Link to="/">Home Page</Link>
                <Link to="/createpost">Create A Post</Link>
              </>
            )}
          </div>
          <div className="loggedInContainer">
            {/* Not showing the username anymore when logged out */}
            {authState.status ? <h1>{authState.username}</h1> : ""}
            {/* Log out button appeared when logged IN */}
            {authState.status && <button onClick={logout}> Logout</button>}
          </div>
        </div>
        <Routes>
          {/* "/": The route for the main entry point of the website */}
          {/* "exact": To make never renders more than one route at the same time */}
          {/* "component": The component to render in this route */}
          <Route path="/" exact element={<Home />} />
          <Route path="/createpost" exact element={<CreatePost />} />
          <Route path="/post/:id" exact element={<Post />} />
          <Route path="/registration" exact element={<Registraion />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/profile/:id" exact element={<Profile />} />
          {/* STEP 3 */}
          <Route path="/changepassword" exact element={<ChangePassword />} />
          <Route path="*" exact Component={PageNotFound} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
