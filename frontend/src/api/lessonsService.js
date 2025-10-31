import axios from "axios";

export const getChatData = async (username, locationId) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
    params: { username, location_id: locationId },
  });
  return response.data.messages;
};

export const getLessonMessage = async (
  currentBlock,
  currentLesson,
  currentMinilesson,
  progress,
  land,
  user
) => {
  const requestBody = {
    currentBlock,
    currentLesson,
    currentMinilesson,
    progress,
    land,
    user,
  };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/langchain/lessonMessage`,
    requestBody
  );
  return response.data;
};

export const getWelcomeMessage = async (
  currentBlock,
  currentLesson,
  currentMinilesson,
  progress,
  land,
  user
) => {
  const requestBody = {
    currentBlock,
    currentLesson,
    currentMinilesson,
    progress,
    land,
    user,
  };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/langchain/welcome`,
    requestBody
  );
  return response.data;
};

export const getLessonsNames = async (locationName) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/langchain/lessonNames`,
    {
      params: { locationName: locationName },
    }
  );
  return response.data.message;
};

export const getUserMessage = async (
  currentLesson,
  currentMinilesson,
  user,
  land,
  message
) => {
  const requestBody = {
    currentLesson,
    currentMinilesson,
    user,
    land,
    message,
  };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/langchain/userMessage`,
    requestBody
  );
  return response.data;
};

export const evaluateQuestion = async (question, userAnswer, user) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/langchain/evaluateQuestion`,
      {
        user,
        question: question.question,
        userAnswer,
        correctAnswerExample: question.correct_answer,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return { success: false };
  }
};

export const getFreeFormUserMessage = async (user, landId, message, type) => {
  const requestBody = {
    user,
    landId,
    message,
    type,
  };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/langchain/freeformUserMessage`,
    requestBody
  );
  return response.data;
};
