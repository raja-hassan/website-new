import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomNavbar from "../../Components/CustomNavbar/CustomNavbar";
import CustomFooter from "../../Components/CustomFooter/CustomFooter";
import CustomCarousel from "../../Components/CustomCarousel/CustomCarousel";
import User from "../../Assets/user.jpg";
import Subject from "../../Assets/subject.jpg";
import Topic from "../../Assets/topic.jpg";
import Question from "../../Assets/question.jpg";

import Maths from "../../Assets/maths.jpg";
import English from "../../Assets/english.jpg";
import Physics from "../../Assets/physics.jpg";
import ITC from "../../Assets/itc.jpg";
import DSA from "../../Assets/dsa.jpg";
import CustomCard from "../../Components/CustomCard/CustomCard";
import Card1 from "../../Assets/derivation.jpg";
import Card2 from "../../Assets/wordformation.jpg";
import Card3 from "../../Assets/c++.jpg";

import "./landingpage.scss";

function LandingPage() {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!userRole) {
      navigate("/login");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/subjects`
        );
        const result = await response.json();
        setSubjects(result.data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/topics`
        );
        const result = await response.json();
        setTopics(result.data || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleClick = () => {
    if (userRole === "user") {
      navigate("/exam");
    } else if (userRole === "admin") {
      navigate("/user");
    }
  };

  const cardImages = [Card1, Card2, Card3];

  if (userRole === "admin") {
    return (
      <>
        <CustomNavbar />
        <div className="container" style={{ paddingTop: "80px" }}>
          <h5
            className="mb-4 "
            style={{ fontWeight: "bold", fontSize: "1.8rem", color: "#2C3E50" }}
          >
            Explore{" "}
          </h5>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="image-card" onClick={handleClick}>
                <img
                  src={User}
                  alt="User"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="image-overlay">
                  <h4>Users</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="image-card" onClick={handleClick}>
                <img
                  src={Subject}
                  alt="Subject"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="image-overlay">
                  <h4>Subjects</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="image-card" onClick={handleClick}>
                <img
                  src={Question}
                  alt="Question"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="image-overlay">
                  <h4>Questions</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="image-card" onClick={handleClick}>
                <img
                  src={Topic}
                  alt="Topic"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="image-overlay">
                  <h4>Topics</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CustomCarousel />
        <CustomFooter />
      </>
    );
  }

  if (userRole === "user") {
    return (
      <>
        <CustomNavbar />

        <div className="container" style={{ paddingTop: "80px" }}>
          <h5 className="mb-3">Explore Subjects</h5>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div
                className="user_container"
                onClick={handleClick}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={Maths}
                  className="w-100"
                  style={{
                    height: "313px",
                  }}
                  alt="Maths"
                />
                <div className="overlay">{subjects[0]?.name}</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row">
                {subjects.slice(1, 5).map((subject, index) => (
                  <div
                    className="col-md-6 mb-2"
                    key={index}
                    onClick={handleClick}
                  >
                    <div
                      className="user_container"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          index === 0
                            ? English
                            : index === 1
                            ? ITC
                            : index === 2
                            ? DSA
                            : Physics
                        }
                        className="w-100"
                        style={{
                          height: "150px",
                        }}
                        alt={subject.name}
                      />
                      <div className="overlay">{subject.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h5 className="mb-3 mt-5">Explore Topics</h5>
          <div
            className="row mb-3"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {topics.slice(0, 3).map((topic, index) => (
              <div className="col-md-4 mb-3" key={topic._id}>
                <CustomCard
                  cardimg={cardImages[index]}
                  cardTitle={topic.name}
                  cardText={topic.description}
                />
              </div>
            ))}
          </div>
        </div>
        <CustomFooter />
      </>
    );
  }

  return null;
}

export default LandingPage;
