import Link from "next/link";
import "./style.css";
import FriendsComponent from "../components/HomePage/FriendsComponent.jsx";

import React, { useContext, useEffect } from "react";
import LandDataContext from "../context/LandDataContext";
import { pingServer } from "@/api";

function HomePage() {
  const landData = useContext(LandDataContext);

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <div>
      <div className="homepageTitleContainer">
        <img src="/icons/logo.png" alt="logo" className="logo"/>
        <div>
          <h1 className="homePageTitle">FinGenie</h1>
          <div className="buttonContainer">
            <Link href="/register" legacyBehavior>
              <a className="registerButton">Register</a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a className="loginButton">Login</a>
            </Link>
          </div>
        </div>
      </div>
      {/* Features Section */}
<div className="featuresContainer">
  <h2 className="featuresTitle">FEATURES</h2>
  <div className="featuresGrid">
    <div className="featureCard">
      <img src="/icons/credit-score.png" alt="Credit Scoring Engine" className="featureIcon" />
      <p className="featureText">Credit Scoring Engine</p>
    </div>
    <div className="featureCard">
      <img src="/icons/ai-chatbot.png" alt="AI Chatbot Mentor" className="featureIcon" />
      <p className="featureText">AI Chatbot Mentor</p>
    </div>
    <div className="featureCard">
      <img src="/icons/gamification.png" alt="Gamification Learning" className="featureIcon" />
      <p className="featureText">Gamified Learning</p>
    </div>
    <div className="featureCard">
      <img src="/icons/fraud.png" alt="Smart Personal Finance Chatbot" className="featureIcon" />
      <p className="featureText">Fraud Detection</p>
    </div>
    <div className="featureCard">
      <img src="/icons/visualization.png" alt="Visualization" className="featureIcon" />
      <p className="featureText">Smart Personal Dashboard</p>
    </div>
    <div className="featureCard">
      <img src="/icons/multilanguage.png" alt="Multilanguage" className="featureIcon" />
      <p className="featureText">Multilingual Support</p>
    </div>
  </div>
</div>

      <p className="homePageTitle meetFriendsTitle" style={{ marginLeft: "8%" }}>
        MEET THE FRIENDS:
      </p>
      <div>
        {landData.map((land) => (
          <FriendsComponent key={land.id} land={land} />
        ))}
      </div>
      <div className="buttonContainer" style={{ marginBottom: "2rem" }}>
        <Link href="/dashboard" passHref>
          <button className="loginButton" style={{ cursor: "pointer" }}>
            Let&apos;s Learn!
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
