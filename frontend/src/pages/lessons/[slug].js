import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { useRouter } from "next/router";
import LandDataContext from "../../context/LandDataContext";
import MessageComponent from "@/components/Lessons/MessageComponent";
import {
  getChatData,
  getFreeFormUserMessage,
  getLessonMessage,
  getLessonsNames,
  getUserMessage,
  getWelcomeMessage,
} from "@/api";
import LessonsListComponent from "@/components/Lessons/LessonsListComponent";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthProvider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

function LessonsComponent() {
  let [chatData, setChatData] = useState([]);
  const [lessonNames, setLessonNames] = useState([]);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState("");

  const landData = useContext(LandDataContext);

  const router = useRouter();
  const { slug } = router.query;
  const land = landData.find((item) => item.id === slug);

  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentMinilesson, setCurrentMinilesson] = useState(0);
  let progress = 0;

  const [welcomeMessageLoaded, setWelcomeMessageLoaded] = useState(false);

  const [landBackgroundImage, setLandBackgroundImage] = useState({});

  const [loading, setTyping] = useState(false);

  const { currentUser, currentUserStats, refreshProfileStats } = useAuth();

  const loadingMessage = {
    sender: "AI",
    content: "typing...",
  };

  useEffect(() => {
    if (currentUser === undefined) {
      router.push("/login");
    } else if (currentUser !== null) {
      refreshProfileStats();
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser && router.isReady && slug) {
      const land = landData.find((item) => item.id === slug);
      if (land) {
        setCurrentLesson(currentUserStats.progress[land?.id]?.lessonId);
        setCurrentMinilesson(currentUserStats.progress[land?.id]?.minilessonId);
        setCurrentBlock(currentUserStats.progress[land?.id]?.blockId);

        setLandBackgroundImage({
          background: `linear-gradient(0deg, rgba(22, 0, 160, 0.34) 0%, rgba(22, 0, 160, 0.34) 100%), url(${land.landImage}), lightgray 50% / cover no-repeat`,
        });
        loadChatData(currentUser.username, slug);
        if (land?.id != 5) {
          loadLessonNames(land.name);
        }
      }
    }
  }, [currentUser, currentUserStats, landData, router, slug]);

  useEffect(() => {
    if (currentUser && land && land?.id != 5 && currentUserStats && !welcomeMessageLoaded) {
      loadWelcomeMessage();
      setWelcomeMessageLoaded(true);
    }
  }, [currentUser, land, currentUserStats]);

  const loadChatData = async (username, locationId) => {
    try {
      let messages = await getChatData(username, locationId);

      messages = messages.reverse();

      setChatData(messages);
    } catch (error) {
      console.error("Error geting chat data:", error);
    }
  };

  const loadLessonNames = async (name) => {
    try {
      const lessonNames = await getLessonsNames(name);
      setLessonNames(lessonNames);
    } catch (error) {
      console.error("Error geting chat data:", error);
    }
  };

  const loadLessonMessage = async () => {
    setTyping(true);
    try {
      const lessonMessage = await getLessonMessage(
        currentBlock,
        currentLesson,
        currentMinilesson,
        progress,
        land,
        currentUser
      );

      setCurrentLesson(lessonMessage.nextIds.lessonId);
      setCurrentMinilesson(lessonMessage.nextIds.minilessonId);
      setCurrentBlock(lessonMessage.nextIds.blockId);

      let newMessage = {
        sender: "AI",
        content: lessonMessage.message,
      };

      if (currentBlock == 2) {
        newMessage.sender = "Quiz";
      }

      setChatData([newMessage, ...chatData]);
      setTyping(false);
    } catch (error) {
      console.error("Error fetching lesson message:", error);
    }
  };

  const loadWelcomeMessage = async () => {
    setTyping(true);
    try {
      const welcomeMessage = await getWelcomeMessage(
        currentBlock,
        currentLesson,
        currentMinilesson,
        currentUserStats?.completionPercentages[land?.id],
        land,
        currentUser
      );

      let newMessage = {
        sender: "AI",
        content: welcomeMessage.message,
      };

      setChatData((prevChatData) => [newMessage, ...prevChatData]);
      setTyping(false);
    } catch (error) {
      console.error("Error fetching lesson message:", error);
    }
  };

  const [type, setType] = useState("text");

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = async () => {
    try {
      setTyping(true);

      const newUserMessage = {
        sender: "User",
        content: inputValue,
      };

      setChatData((currentChatData) => [newUserMessage, ...currentChatData]);
      setInputValue("");

      let response = "";
      if (land?.id != 5) {
        response = await getUserMessage(
          currentLesson,
          currentMinilesson,
          currentUser,
          land,
          inputValue
        );
      } else {
        let landId = land?.id;
        response = await getFreeFormUserMessage(
          currentUser,
          landId,
          inputValue,
          type
        );
      }

      let newAIResponse = {
        sender: "AI",
        content: response.message,
      };

      setChatData((currentChatData) => [newAIResponse, ...currentChatData]);
      setTyping(false);
    } catch (error) {
      console.error("Error fetching user message:", error);
      setTyping(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="lessonsWrapper">
        <div className="lessonsContainer">
          <div className="chatContainer">
            <div className="chatHeader">
              <p className="chatHeaderText">Current location: {land?.name}</p>
              {land?.id == 5 && (
                <div className="selectContainer">
                  <InputLabel>Response Format</InputLabel>
                  <Select value={type} label="Type" onChange={handleTypeChange}>
                    <MenuItem value={"text"}>Text</MenuItem>
                    <MenuItem value={"image"}>Image</MenuItem>
                  </Select>
                </div>
              )}
            </div>
            <div style={landBackgroundImage} className="chatBodyContainer">
              <div className="chatBody">
                {loading && (
                  <div>
                    <MessageComponent
                      msg={loadingMessage}
                      land={land}
                      user={currentUser}
                    />
                  </div>
                )}

                {chatData.map((msg, index) => (
                  <div key={index}>
                    <MessageComponent
                      key={index}
                      msg={msg}
                      land={land}
                      user={currentUser}
                    />
                  </div>
                ))}
              </div>
              <p
                className={`chatButton nextButton ${loading ? "disabled" : ""}`}
                onClick={() => {
                  !loading && loadLessonMessage();
                }}
              >
                Next
              </p>
            </div>

            <div className="chatSendMessage">
              <div className="chatSendMessageContainer">
                <input
                  className="inputMessage"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <p
                  className={`chatButton submitButton ${
                    loading ? "disabled" : ""
                  }`}
                  onClick={() => {
                    !loading && handleSearchClick();
                  }}
                >
                  Submit
                </p>
              </div>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
        {land?.id != 5 && (
          <LessonsListComponent
            lessonNames={lessonNames}
            land={land}
            currentLesson={currentLesson}
            currentMinilesson={currentMinilesson}
          />
        )}
      </div>
    </>
  );
}

export default LessonsComponent;
