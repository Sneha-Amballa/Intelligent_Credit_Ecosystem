import React, { useState, useEffect } from "react";
import "./Popup.css";
import { useAuth } from "@/context/AuthProvider";
import { resetUserStats } from "@/api";

export default function ChangeUsernameModal() {
  const [modal, setModal] = useState(false);
  const { currentUser, refreshProfileStats } = useAuth();

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleYesClick = async () => {
    await resetUserStats(currentUser.username)
    refreshProfileStats();
    toggleModal()
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
        Reset progress
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Reset progress</h2>
            <p className="reset-txt">
              Are you sure you want to reset your progress?
            </p>
            <div className="btn-yes-no">
              {/* Add handleYesClick to the onClick event of the yes button */}
              <button className="yesbtn btn-modal" onClick={handleYesClick}>YES</button>
              <button className="nobtn btn-modal" onClick={toggleModal}>NO</button>
            </div>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
