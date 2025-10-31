import React, { useEffect, useState, useContext } from "react";
import ".//Profile.css";
import SemiCircleProgressBar from "react-progressbar-semicircle";
import { useAuth } from "@/context/AuthProvider";
import LandDataContext from "@/context/LandDataContext";
import { useRouter } from "next/router";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import ResetProgressModal from "./ResetProgressModal";
const UserProfileStats = () => {
  const landData = useContext(LandDataContext);

  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);

  const openChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
  };
  const [formattedDate, setFormattedDate] = useState(null);

  const router = useRouter();

  const { currentUser, currentUserStats, refreshProfileStats } = useAuth();

  useEffect(() => {
    if (currentUser === null) {
      return;
    }

    if (currentUser === undefined) {
      router.push("/login");
    } else {
      refreshProfileStats();
      const dateString = currentUser.dateOfBirth;

      const date = new Date(dateString);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      setFormattedDate(`${day}.${month}.${year}.`);
    }
  }, [currentUser, router]);

  return (
    <div>
      <div className="my-profile">
        <h3>My profile</h3>
      </div>
      <div className="profile-info-settings">
        <div className="profile-info">
          <h3 className="h3-title">Profile info:</h3>
          <div className="user-info-details">
            <img src="/pfp/pfp.png" alt="pfp" />
            <div id="user-info-text-details">
              <h3>{currentUser?.username}</h3>
              <ul>
                <li>
                  <b>e-mail:</b> {currentUser?.email}
                </li>
                <li>
                  <b>date of birth:</b> {formattedDate}
                </li>
                <li>
                  <b>country:</b> {currentUser?.countryOfOrigin}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="settings">
          <h3>Settings:</h3>
          <div className="settings-list">
            <ul>
              <li>
                <ChangeUsernameModal />
              </li>
              <li>
                <ChangePasswordModal />
              </li>
              <li>
                <ResetProgressModal />
              </li>
              <li>
                <a
                  href="mailto:financefriends0@gmail.com"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-profile">
        <h3>My stats</h3>
      </div>
      <div className="all-stats-bars">
        <div className="text-total-bar">
          <h3>Game completion:</h3>

          <div className="element">
            <div id="prog-bar1">
              <div className="bar">
                <SemiCircleProgressBar
                  percentage={Math.round(currentUserStats?.totalCompletion)}
                  stroke="#00FF66"
                  strokeWidth={16}
                  background="#fff"
                  diameter={210}
                />
              </div>
              <div>
                <div className="progress-text">
                  <p>Overall completion</p>
                </div>
                <div className="percentage">
                  <p>{Math.round(currentUserStats?.totalCompletion)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="each-land-bar">
          <ul>
            {landData.slice(0, -1).map((land, index) => (
              <li key={index}>
                <div id="prog-bar2">
                  <div className="bar2">
                    <SemiCircleProgressBar
                      percentage={Math.round(
                        currentUserStats?.completionPercentages[index]
                      )}
                      stroke="#FFC700"
                      strokeWidth={16}
                      background="#fff"
                      diameter={160}
                    />
                  </div>
                  <div className="land-text">
                    <p>{land.name}</p>
                  </div>
                  <div className="percentage">
                    <p>
                      {Math.round(
                        currentUserStats?.completionPercentages[index]
                      )}
                      %
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="point-count">
        <div className="points-overall">
          <h3>Points:</h3>
          <div className="element">
            <p id="overall-numb">{currentUserStats?.totalPoints}</p>
            <p id="overall-txt">overall</p>
          </div>
        </div>
        <div className="land-points">
          {landData.slice(0, -1).map((land, index) => (
            <div key={index} className="element">
              <p className="each-land-points">
                {currentUserStats?.points[index]}
              </p>
              <p className="each-land-txt">{land.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="quizzes">
        <div id="quizzes-text">
          <h3>Quizzes:</h3>
        </div>
        <div className="group">
          <div id="incorrect-answers">
            <p className="incorrect-answers-num">
              {currentUserStats?.incorrectAnswers}
            </p>
            <p className="incorrect-answers-txt">incorrect answers</p>
          </div>
          <div id="prog-bar1">
            <div className="bar">
              <SemiCircleProgressBar
                percentage={Math.round(
                  currentUserStats?.correctAnswersPercentage
                )}
                stroke="#00FF66"
                strokeWidth={16}
                background="#fff"
                diameter={210}
              />
            </div>
            <div className="progress-text">Percentage correct</div>
            <div className="percentage">
              {Math.round(currentUserStats?.correctAnswersPercentage)}%
            </div>
          </div>
          <div id="correct-answers">
            <p className="correct-answers-num">
              {currentUserStats?.correctAnswers}
            </p>
            <p className="correct-answers-txt">correct answers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStats;
