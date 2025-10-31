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
          <h1 className="homePageTitle">FinanceFriends</h1>
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
      <div>
        <div className="introContainer">
          <div className="introTextContainer">
            <p className="homePageText">
              This revolutionary chatbot is designed to engage and educate
              children in the nuances of financial literacy. Utilizing
              sophisticated artificial intelligence, Finance Friends offers
              interactive, personalized learning experiences, making complex
              financial concepts accessible and enjoyable for the younger
              generation. By blending advanced technology with child-friendly
              content, we&apos;re setting a new standard in empowering the
              financial leaders of tomorrow.
            </p>
          </div>
          <div className="">
            <img
              className="diagonal"
              src="/bg/bg-intro-diagonal.png"
              alt="logo"
            />
          </div>
          <div className="introDataContainer">
            <div className="introDataContent">
              <p className="introDataTitle">AI</p>
              <p className="introDataSubTitle">POWERED</p>
            </div>
            <div className="introDataContent">
              <p className="introDataTitle">6</p>
              <p className="introDataSubTitle">MODULES</p>
            </div>
            <div className="introDataContent">
              <p className="introDataTitle">1000+</p>
              <p className="introDataSubTitle">QUESTIONS</p>
            </div>
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
