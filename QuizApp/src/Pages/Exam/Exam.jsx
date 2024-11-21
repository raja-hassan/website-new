import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import CustomOffcanvas from "../../Components/CustomOffcanvas/CustomOffcanvas";
import CustomSelectField from "../../Components/CustomSelectField/CustomSelectField";
import { setExamId, setScores, setExamDetails } from "../../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Exam.scss";
import * as Yup from "yup";

function Exam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [formData, setFormData] = useState({
    subjects: [],
    topics: [],
    level: "",
  });

  const levels = [
    { value: 0, label: "Easy" },
    { value: 1, label: "Medium" },
    { value: 2, label: "Hard" },
  ];

  const validationSchema = Yup.object({
    subjects: Yup.array()
      .min(1, "Subject is required ")
      .required("Subjects are required"),
    topics: Yup.array().optional(),
    level: Yup.string().optional(),
  });

  const subjectIds = formData.subjects.join(",");
  const topicIds = formData.topics.join(",");
  const level = formData.level;

  const queryParams = {
    user: userId,
    subject: subjectIds,
    topics: topicIds,
    level: level,
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/subjects`
      );
      const result = await response.json();
      const subjectData =
        result?.data?.map((element) => ({
          label: element.name,
          value: element._id,
        })) || [];
      setSubjects(subjectData);
    } catch (error) {
      console.error("Error fetching Subjects:", error);
    }
  };

  const fetchExams = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/exam?user=${userId}`,
        { method: "GET" }
      );
      const result = await response.json();
      if (response.ok) {
        setExams(result.data || []);
      } else {
        console.error("Error fetching exams:", result.message);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      let selectedTopics = formData.topics;
      if (
        formData.subjects.length > 0 &&
        topics.length > 0 &&
        selectedTopics.length === 0
      ) {
        selectedTopics = topics.map((topic) => topic.value);
        setFormData((prev) => ({ ...prev, topics: selectedTopics }));
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/exam/generate?user=${
          queryParams.user
        }&subject=${queryParams.subject}&topics=${selectedTopics.join(
          ","
        )}&level=${queryParams.level}`,
        { method: "GET" }
      );

      if (response.status === 404) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "No question found for the given criteria",
        }));
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await response.json();

      if (!result.data || !result.data._id) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "No question found for the given criteria",
        }));
        return;
      }

      const ExamId = result.data._id;
      dispatch(setExamId(ExamId));
      navigate("/test");

      setFormData({
        subjects: [],
        topics: [],
        level: "",
      });
      setErrors({});
      setShowOffcanvas(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        const formErrors = {};
        error.inner.forEach((err) => {
          formErrors[err.path] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Error creating exam:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "An unexpected error occurred. Please try again.",
        }));
      }
    }
  };

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const fetchTopicsBySubject = async (subjectId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/topics?subject=${subjectId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const topicData =
        result?.data?.map((element) => ({
          label: element.name,
          value: element._id,
        })) || [];

      setTopics(topicData.length > 0 ? topicData : []);
    } catch (error) {
      console.error("Error fetching Topics by Subject:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "subjects") {
      const selectedValues = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, subjects: selectedValues }));

      if (selectedValues.length > 0) {
        fetchTopicsBySubject(selectedValues[0]);
      } else {
        setTopics([]);
      }
    } else if (name === "topics") {
      const selectedValues = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, topics: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLevelChange = (event) => {
    const selectedValue = event.target.value;
    setFormData((prev) => ({ ...prev, level: selectedValue }));

    setErrors((prevErrors) => ({ ...prevErrors, level: "" }));
  };

  const handleClick = (examId) => {
    console.log("Clicked exam ID:", examId);
    dispatch(setExamId(examId));
  };

  const handleViewResults = (
    examId,
    obtainedScore,
    totalScore,
    subjectNames,
    topicNames
  ) => {
    console.log(`Viewing results for exam ID: ${examId}`);

    dispatch(setExamId(examId));
    dispatch(setScores({ obtainedScore, totalScore }));

    const subjects = Array.isArray(subjectNames)
      ? subjectNames
      : [subjectNames];

    const topics = Array.isArray(topicNames) ? topicNames : [topicNames];

    dispatch(setExamDetails({ subjectNames: subjects, topicNames: topics }));
  };

  const data = {
    columns: [
      { label: "Subject Name", field: "subject", sort: "disabled", width: 200 },
      { label: "Topic Name", field: "topic", sort: "disabled", width: 200 },
      { label: "Start", field: "start", sort: "disabled", width: 100 },
    ],
    rows: exams.map((exam) => {
      const obtainedScore = exam?.obtainedScore || 0;
      const totalScore = exam?.totalScore || 0;
      const subjectNames = Array.isArray(exam?.subject?.name)
        ? exam?.subject?.name
        : [exam?.subject?.name || "N/A"];

      const topicNames = exam?.topics?.length
        ? exam?.topics.map((topic) => topic.name)
        : ["N/A"];

      return {
        topic: topicNames.join(", "),
        subject: subjectNames.join(", "),
        start: exam.isCompleted ? (
          <Link to="/result">
            <button
              type="button"
              className="btn btn-view"
              onClick={() =>
                handleViewResults(
                  exam._id,
                  obtainedScore,
                  totalScore,
                  subjectNames,
                  topicNames
                )
              }
            >
              View Results
            </button>
          </Link>
        ) : (
          <Link to="/test" onClick={() => handleClick(exam._id)}>
            <button type="button" className="btn btn-start">
              Start Exam
            </button>
          </Link>
        ),
      };
    }),
  };

  const fields = [
    <CustomSelectField
      label={
        <span>
          Subject
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="subjects"
      placeholder="Choose Subject"
      multiple={false}
      options={subjects}
      onChange={handleInputChange}
      value={formData.subjects}
      error={errors.subjects}
    />,

    <CustomSelectField
      label="Topic(s)"
      name="topics"
      placeholder="Choose Topics"
      multiple={true}
      options={topics}
      onChange={handleInputChange}
      value={formData.topics}
      error={errors.topics}
    />,

    <CustomSelectField
      label="Level"
      name="level"
      placeholder="Choose Level"
      options={levels}
      multiple={false}
      onChange={handleLevelChange}
      value={formData.level}
      error={errors.level}
    />,

    errors.general && (
      <div
        className="text-danger"
        style={{ fontSize: "15px", marginTop: "10px" }}
      >
        {errors.general}
      </div>
    ),
  ];

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <h1 className="text-center my-4 fs-3 page-title">Exam</h1>
          <div className="text-end d-block mb-4">
            <CustomOffcanvas
              btnText="Add Exam"
              headtitle="Add Exam"
              fields={fields}
              onSubmit={handleSave}
              show={showOffcanvas}
              setShow={setShowOffcanvas}
            />
          </div>
          <CDBCard>
            <CDBCardBody className="p-4">
              <CDBDataTable
                striped
                bordered
                hover
                entriesOptions={[5, 20, 25]}
                entries={5}
                pagesAmount={4}
                data={data}
                materialSearch={true}
                style={{ marginTop: "15px" }}
              />
            </CDBCardBody>
          </CDBCard>
        </div>
      </div>
    </div>
  );
}

export default Exam;
