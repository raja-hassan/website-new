import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import "./Result.scss";

function Result() {
  const navigate = useNavigate();
  const { examId, obtainedScore, totalScore, examDetails } = useSelector(
    (state) => state.user
  );
  const [counter, setCounter] = useState(1);

  if (counter === 0) {
    return (
      <div className="container">
        <h5 className="text-center mb-4">Loading...</h5>
      </div>
    );
  }

  if (!examId || obtainedScore === undefined || totalScore === undefined) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="text-center">
            <h4 className="text-warning mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i> No Results
              Available
            </h4>
            <p className="text-muted mb-4">
              Unfortunately, we couldn't find any results for your exam attempt.
              Please try again later or return to the exam.
            </p>
            <button
              className="btn  btn-lg "
              onClick={() => navigate("/exam")}
              style={{ backgroundColor: "#69AFC5", color: "white" }}
            >
              Back to Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = ((obtainedScore / totalScore) * 100).toFixed(2);

  const data = [
    { name: "Score", value: obtainedScore },
    { name: "Remaining", value: totalScore - obtainedScore },
  ];

  return (
    <div className="result-page">
      <section className="hero-section bg-primary text-white text-center p-5">
        <h1 className="display-4">Your Performance Unveiled</h1>
        <p className="lead">
          Curious about your exam score? Let's find out together!
        </p>
      </section>

      <div className="container mt-4">
        <h5 className="text-center mb-4 text-primary">Exam Results</h5>
        <div className="result-card p-4 bg-light shadow-lg rounded-lg">
          <div className="exam-details mb-4">
            <h6>
              <strong>Subject Name(s) : </strong>{" "}
              {examDetails.subjectNames.join(", ")}
            </h6>
            <h6>
              <strong>Topic Name(s) : </strong>{" "}
              {examDetails.topicNames.length > 0
                ? examDetails.topicNames.join(", ")
                : "N/A"}
            </h6>
          </div>

          <div className="score-summary d-flex justify-content-between mb-3">
            <div>
              <h6>
                <strong>Obtained Score:</strong> {obtainedScore}
              </h6>
            </div>
            <div>
              <h6>
                <strong>Total Score:</strong> {totalScore}
              </h6>
            </div>
          </div>

          <div className="progress-container mb-4">
            <div className="progress" style={{ height: "30px" }}>
              <div
                className={`progress-bar ${
                  percentage >= 50 ? "success" : "fail"
                }`}
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percentage}%
              </div>
            </div>
          </div>

          <div className="status-message text-center mb-4">
            <h4>
              {percentage >= 50 ? (
                <>
                  <FaCheckCircle className="text-success" /> Congratulations,
                  you passed!
                  <Confetti />
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-danger " /> Better luck next
                  time!
                </>
              )}
            </h4>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/exam")}
            >
              Back to Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
