import React, { useState } from "react";
import "./QuizComponent.css";

import { evaluateQuestion, updateUserStats } from "@/api";

function QuizComponent({ quiz, user, land }) {
  var jsonString = quiz.replace(/\`\`\`json|\`\`\`/g, "").trim();
  var questionsArray = JSON.parse(jsonString);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [score, setScore] = useState(0);
  const [evaluationResults, setEvaluationResults] = useState({});

  const [loading, setLoading] = useState(false);

  const handleResponse = (questionIndex, response) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: response,
    });
  };

  const handleInputChange = (questionIndex, event) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: event.target.value,
    });
  };

  const evaluateQuiz = async () => {
    setLoading(true);
    let localScore = 0;
    const evaluationPromises = [];

    questionsArray.forEach((question, index) => {
      const userAnswer = selectedOptions[index] || "";

      if (
        question.type !== "Multiple Choice" &&
        question.type !== "True/False" &&
        userAnswer !== ""
      ) {
        evaluationPromises.push(evaluateQuestion(question, userAnswer, user));
      } else {
        if (userAnswer === question.correct_answer) {
          localScore += 1;
        }
      }
    });

    const evaluations = await Promise.all(evaluationPromises);

    let newEvaluationResults = {};
    let fillInTheBlankScore = 0;
    evaluations.forEach((evaluation, index) => {
      try {
        const evaluationData = JSON.parse(evaluation.message);
        newEvaluationResults[index] = evaluationData.evaluation;
        if (evaluationData.evaluation) {
          fillInTheBlankScore += 1;
        }
      } catch (error) {
        console.error("Error parsing evaluation data:", error);
        newEvaluationResults[index] = false;
      }
    });

    setEvaluationResults(newEvaluationResults);

    let finalScore = localScore + fillInTheBlankScore;
    setScore(finalScore);
    setQuizCompleted(true);

    updateUserStats(user.username, {
      newPoints: finalScore * 50,
      locationId: land.id,
      correctAnswers: finalScore,
      incorrectAnswers: 5 - finalScore,
    });

    setLoading(false);
  };

  const getButtonStyle = (questionIndex, option) => {
    const isSelected = selectedOptions[questionIndex] === option;
    const isCorrect = questionsArray[questionIndex].correct_answer === option;

    if (quizCompleted) {
      if (isCorrect) {
        return "quizBtn choiceBtn correct";
      } else if (isSelected) {
        return "quizBtn choiceBtn selected";
      }
    } else {
      return isSelected ? "quizBtn choiceBtn selected" : "quizBtn choiceBtn";
    }

    return "quizBtn choiceBtn";
  };

  const getInputStyle = (questionIndex) => {
    if (
      quizCompleted &&
      questionsArray[questionIndex].type !== "Multiple Choice" &&
      questionsArray[questionIndex].type !== "True/False"
    ) {
      const fillInTheBlankCount = questionsArray
        .slice(0, questionIndex + 1)
        .filter(
          (q, i) => q.type !== "Multiple Choice" && q.type !== "True/False"
        ).length;
      const isCorrect = evaluationResults[fillInTheBlankCount - 1];
      return isCorrect ? "inputMessage correct" : "inputMessage incorrect";
    }
    return "inputMessage";
  };

  return (
    <div>
      <p className="questionIndex" style={{ marginTop: "0px" }}>
        Quiz Time!
      </p>

      {questionsArray.map((question, index) => (
        <div key={index}>
          <p className="questionIndex">Question {index + 1}!</p>
          {question.type === "True/False" && (
            <div>
              <p>{question.question}</p>
              <div className="quizBtnContainer">
                <button
                  className={getButtonStyle(index, "True")}
                  onClick={() => handleResponse(index, "True")}
                >
                  <p>TRUE</p>
                </button>
                <button
                  className={getButtonStyle(index, "False")}
                  onClick={() => handleResponse(index, "False")}
                >
                  <p>FALSE</p>
                </button>
              </div>
            </div>
          )}
          {question.type === "Multiple Choice" && (
            <div>
              <p>{question.question}</p>
              <div className="quizBtnContainer choiceBtns">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className={getButtonStyle(index, option)}
                    onClick={() => handleResponse(index, option)}
                  >
                    <p>{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {question.type !== "Multiple Choice" &&
            question.type !== "True/False" && (
              <div>
                <p>{question.question}</p>
                <div className="fillBlankInput">
                  <input
                    className={getInputStyle(index)}
                    type="text"
                    value={selectedOptions[index] || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              </div>
            )}
        </div>
      ))}

      {!quizCompleted ? (
        <div className="quizBtnContainer choiceBtns">
          <button
            className={`quizBtn finishBtn ${loading ? "disabledFinish" : ""}`}
            onClick={() => {
              !loading && evaluateQuiz();
            }}
            disabled={loading}
          >
            <p>{loading ? "Evaluating Answers..." : "FINISH QUIZ!"}</p>
          </button>
        </div>
      ) : (
        <div className="quizBtnContainer choiceBtns">
          <div className="quizCompleteContainer">
            <p className="questionIndex">QUIZ COMPLETE!</p>
            <p>You answered {score}/5 questions correctly</p>
            <p>You earned {score * 50} points for this quiz</p>
            {score > 2 ? (
              <p>Good job!</p>
            ) : (
              <p>Pay attention to the lessons and practice more!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizComponent;
