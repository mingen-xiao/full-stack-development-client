// STEP 1
import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  // STEP 7
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    // Be able to take in both the "useState" and make the "axios" PUT request
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          // Follow what's in STEP 6
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div>
      {/* STEP 5 */}
      <h1>Change Your Password</h1>
      {/* "onChange": save the new changes user wrote in this input by applying "useState" */}
      <input
        type="text"
        placeholder="Old Password..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}>Save Changes</button>
    </div>
  );
}

export default ChangePassword;
