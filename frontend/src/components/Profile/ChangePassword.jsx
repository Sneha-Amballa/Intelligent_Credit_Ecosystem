import React, { useState } from "react";
import "./Popup.css";
import { updateUserInfo } from "@/api/userService";
import { login as backendLogin } from "@/api/userService";

const ChangePassword = ({ currentUsername }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async () => {
    setError("")
    try {
      if (!password) {
        setError("New username cannot be empty");
        return;
      }

      try {
        const loginData = {
          login: currentUsername,
          password: currentPassword,
        };
        const response = await backendLogin(loginData);

        if (!response.success) {
          setError("Wrong current password! Please try again.");
          return
        }
      } catch (error) {
        setError("Wrong current password! Please try again.");
        return
      }

      const userData = {
        password,
      };

      const response = await updateUserInfo(currentUsername, userData);

      if (response.success) {
        setError("Password successfully changed");
      }
    } catch (error) {
      setError(error + "! Please try again.");
    }
  };
  return (
    <div className="container">
      <input
        className="inputField"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
      />
      <input
        className="inputField"
        type="password"
        value={password}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button className="updateButton" onClick={handleUpdatePassword}>
        Update Password
      </button>
      {error && <p className="errorMsg">{error}</p>}
    </div>
  );
};

export default ChangePassword;
