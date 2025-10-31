import React, { useState, useEffect } from "react";
import "./Popup.css";
import { useAuth } from "@/context/AuthProvider";
import ChangePassword from "./ChangePassword";

export default function ChangePasswordModal() {
  const [modal, setModal] = useState(false);
  const { currentUser } = useAuth();

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (modal) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }, [modal]);

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Change password
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Change username</h2>
            <p>
              <ChangePassword currentUsername={currentUser.username} />
            </p>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
