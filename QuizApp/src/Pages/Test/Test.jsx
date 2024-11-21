import React, { useEffect, useState } from "react";
import CustomHeader from "../../Components/CustomHeader/CustomHeader";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import CustomQuiz from "../../Components/CustomQuiz/CustomQuiz";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  setIsCompleted,
  setScores,
  setExamDetails,
} from "../../store/userSlice";

function Test() {
  const dispatch = useDispatch();
  const examId = useSelector((state) => state.user.examId);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const navigate = useNavigate();

  const fetchExamData = async (examId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/exam/start/?id=${examId}`
      );
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();
      const mappedQuestions = data.data.map((question) => ({
        id: question._id,
        question: question.title,
        options: question.options.map((option) => ({
          opID: option.opID,
          opText: option.opText,
        })),
      }));
      setQuestions(mappedQuestions);

      if (timeLeft === null) {
        setTimeLeft(mappedQuestions.length * 10);
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setQuestions([]);
    }
  };

  useEffect(() => {
    if (examId) {
      fetchExamData(examId);
    } else {
      setQuestions([]);
    }
  }, [examId]);

  useEffect(() => {
    if (timeLeft > 0 && !isTimeUp) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            alert("Time's up! Submitting the quiz.");
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isTimeUp]);

  const handleAnswerSelect = (questionId, optionId) => {
    if (!isTimeUp) {
      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (answer) => answer.questionId === questionId
        );
        if (existingAnswerIndex !== -1) {
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[existingAnswerIndex].selectedOptionId = optionId;
          return updatedAnswers;
        } else {
          return [...prevAnswers, { questionId, selectedOptionId: optionId }];
        }
      });
      setErrorMessage("");
    }
  };

  const handleSubmit = async (timeUp = false) => {
    try {
      if (timeUp || questions.length === answers.length) {
        const reqBody = { examId: examId, answers: answers };
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/exam/submit`,
          {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          dispatch(setIsCompleted(true));
          const { obtainedScore, totalScore, subject, topics } = data.data;

          const subjectNames = subject ? [subject.name] : [];
          const topicNames =
            topics && Array.isArray(topics)
              ? topics.map((topic) => topic.name)
              : [];

          dispatch(setScores({ obtainedScore, totalScore }));
          handleViewResults(subjectNames, topicNames);

          navigate("/result");
        } else {
          setErrorMessage(
            data.message || "An error occurred while submitting."
          );
        }
      } else {
        setErrorMessage(
          timeUp
            ? "Time's up! Your exam is not submitted."
            : "Please attempt all questions before submitting."
        );
      }
    } catch (err) {
      setErrorMessage(`Something went wrong: ${err}`);
    }
  };

  const handleViewResults = (subjectNames, topicNames) => {
    const subjects = Array.isArray(subjectNames) ? subjectNames : [];
    const topics = Array.isArray(topicNames) ? topicNames : [];
    dispatch(setExamDetails({ subjectNames: subjects, topicNames: topics }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <Link to={"/exam"}>
            <button className="btn btn-secondary mt-4">Back to exam</button>
          </Link>
          <CustomHeader pagetitle="Start Quiz" />
          <div className="quiz-container mt-4 p-3">
            {questions.length > 0 ? (
              <>
                <div className="timer mb-4 text-center">
                  <h3 className="text-danger">
                    Time Remaining: {formatTime(timeLeft || 0)}
                  </h3>
                  {isTimeUp && (
                    <h4 className="text-warning">
                      Time's up! Your exam is not submitted.
                    </h4>
                  )}
                </div>
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="question-card p-4 mb-3 rounded shadow-sm bg-secondary"
                  >
                    <h5 className="question-text mb-3 text-white fw-bold">
                      {index + 1}. {question.question}
                    </h5>
                    <CustomQuiz
                      questionId={question.id}
                      options={question.options}
                      onAnswerSelect={handleAnswerSelect}
                    />
                  </div>
                ))}
                <div className="text-center mt-4">
                  {errorMessage && (
                    <p className="text-danger mb-3">{errorMessage}</p>
                  )}
                  {!isTimeUp && (
                    <button
                      className="btn btn-secondary "
                      onClick={() => handleSubmit()}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </>
            ) : (
              !isTimeUp && (
                <h5 className="text-center">
                  No questions available for this exam.
                </h5>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
