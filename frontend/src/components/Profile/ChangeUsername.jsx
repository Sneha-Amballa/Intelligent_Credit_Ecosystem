import React, { useState } from "react";
import "./Popup.css";
import { updateUserInfo } from "@/api/userService";
import { useAuth } from "@/context/AuthProvider";
const ChangeUsername = ({ currentUsername }) => {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleUpdateUsername = async () => {
    try {
      if (!newUsername) {
        setError("New username cannot be empty");
        return;
      }

      const userData = {
        newUsername,
      };

      const response = await updateUserInfo(currentUsername, userData);

      if (response.success) {
        login(newUsername);
        setError("Username successfully changed");
      }
    } catch (error) {
      setError(error + "! Please try again.");
    }
  };

  return (
    <div className="container">
      <input
        className="inputField"
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Enter new username"
      />
      <button className="updateButton" onClick={handleUpdateUsername}>
        Update Username
      </button>
      {error && <p className="errorMsg">{error}</p>}
    </div>
  );
};

export default ChangeUsername;
