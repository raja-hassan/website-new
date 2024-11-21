import React, { useEffect, useState } from "react";
import { CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomOffcanvas from "../../Components/CustomOffcanvas/CustomOffcanvas";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import CustomSelectField from "../../Components/CustomSelectField/CustomSelectField";
import "./Question.scss";
import * as Yup from "yup";

function Question() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subjects: [],
    topics: [],
    level: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title  cannot exceed 200 characters")
      .required("Question title is required"),
    subjects: Yup.array()
      .min(1, "Subject is required")
      .required("Subjects are required"),
    topics: Yup.array().optional(),
    level: Yup.number()
      .oneOf([0, 1, 2], "Level is required")
      .required("Level is required"),
    options: Yup.array()
      .min(2, "Please select at least two options")
      .required("Options are required"),
  });

  const [optionFields, setOptionFields] = useState([]);

  const levels = [
    { value: 0, label: "Easy" },
    { value: 1, label: "Medium" },
    { value: 2, label: "Hard" },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

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
          subjectId,
        })) || [];

      return topicData;
    } catch (error) {
      console.error("Error fetching Topics by Subject:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaveClicked(true);
    setErrors({});

    const allTopics = formData.subjects.flatMap((subjectId) =>
      topics
        .filter((topic) => topic.subjectId === subjectId)
        .map((t) => t.value)
    );

    const dataToSave = {
      ...formData,
      options: optionFields,
      topics: formData.topics.length > 0 ? formData.topics : allTopics,
    };

    try {
      await validationSchema.validate(dataToSave, { abortEarly: false });

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/questions/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      await response.json();
      fetchQuestions();
      setShowOffcanvas(false);
      setSuccessMessage("Question added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);

      setFormData({
        title: "",
        subjects: [],
        topics: [],
        level: "",
      });
      setTopics([]);
      setOptionFields([]);
      setErrors({});
      setIsSaveClicked(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        const formErrors = {};
        error.inner.forEach((err) => {
          formErrors[err.path] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Error creating question:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    if (name === "subjects") {
      const selectedValues = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, subjects: selectedValues }));

      if (selectedValues.length > 0) {
        Promise.all(selectedValues.map(fetchTopicsBySubject))
          .then((topicsData) => {
            // Flatten the array of topics and remove duplicates by 'value'
            const allTopics = topicsData
              .flat()
              .filter(
                (topic, index, self) =>
                  index === self.findIndex((t) => t.value === topic.value)
              );
            setTopics(allTopics); // Set the topics without duplicates
          })
          .catch((error) => {
            console.error("Error fetching topics:", error);
            setTopics([]); // Reset topics on error
          });
      } else {
        setTopics([]); // Clear topics if no subjects are selected
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

    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleLevelChange = (event) => {
    const selectedValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      level: selectedValue,
    }));

    if (selectedValue) {
      setErrors((prevErrors) => ({ ...prevErrors, level: null }));
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const [isSaveClicked, setIsSaveClicked] = useState(false);

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...optionFields];
    updatedOptions[index][field] = value;
    setOptionFields(updatedOptions);
  };

  const handleAddOption = () => {
    const newOption = {
      opID: optionFields.length + 1,
      opText: "",
      correct: false,
    };
    setOptionFields((prev) => [...prev, newOption]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = optionFields.filter((_, i) => i !== index);
    setOptionFields(updatedOptions);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Deleted subject with id: ${id}`);
        setSuccessMessage("Question deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
        fetchQuestions();
      } else {
        console.error("Error deleting question:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/questions`
      );
      const result = await response.json();
      setQuestions(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching Questions:", error);
    }
  };

  const generateRows = () => {
    if (!Array.isArray(questions)) return [];

    return questions.map((question) => {
      const allTopicsForSubjects = question.subjects.flatMap((subject) =>
        topics
          .filter((topic) => topic.subjectId === subject._id)
          .map((t) => t.name)
      );

      const displayedTopics =
        question.topics.length > 0
          ? question.topics.map((topic) => topic.name)
          : allTopicsForSubjects;

      const topicsToDisplay =
        displayedTopics.length > 0 ? displayedTopics.join(", ") : "N/A";

      return {
        question: question.title,
        subject: question?.subjects?.map((subject) => subject.name).join(", "),
        topic: topicsToDisplay,
        level: question.level,
        actions: (
          <RiDeleteBin6Line
            className="text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(question._id)}
          />
        ),
      };
    });
  };

  const data = {
    columns: [
      {
        label: "Question Title",
        field: "question",
        sort: "disabled",
        width: 150,
      },
      { label: "Subject Name", field: "subject", sort: "disabled", width: 270 },
      { label: "Topic Name", field: "topic", sort: "disabled", width: 150 },
      { label: "Level", field: "level", sort: "disabled", width: 100 },
      { label: "Action", field: "actions", sort: "disabled", width: 100 },
    ],
    rows: generateRows(),
  };

  const fields = [
    <CustomTextField
      label={
        <span>
          Question Title
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="title"
      placeholder="Enter Title"
      onChange={handleInputChange}
      error={errors.title}
      value={formData.title}
    />,
    <CustomSelectField
      label={
        <span>
          Subject(s)
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="subjects"
      placeholder="Choose Subject"
      multiple={true}
      options={subjects}
      onChange={handleInputChange}
      value={formData.subjects}
      error={errors.subjects}
    />,
    <div>
      <CustomSelectField
        label="Topics"
        name="topics"
        placeholder="Choose Topics"
        multiple={true}
        options={topics}
        onChange={handleInputChange}
        value={formData.topics}
        error={errors.topics}
      />
    </div>,

    <CustomSelectField
      label={
        <span>
          Level
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="level"
      placeholder="Choose Level"
      options={levels}
      onChange={handleLevelChange}
      value={formData.level}
      error={errors.level}
    />,
    optionFields.map((option, index) => (
      <div key={index} className="option-field mb-3">
        <div className="row align-items-center">
          <div className="col-auto">
            <label className="fw-bold">{`Option ${option.opID}`}</label>
          </div>
          <div className="col-auto">
            <label className="form-check-label">
              Correct:
              <input
                type="radio"
                name={`correctOption`}
                className="ms-2"
                checked={option.correct}
                onChange={(e) =>
                  handleOptionChange(index, "correct", e.target.checked)
                }
              />
            </label>
          </div>

          <div className="col-auto">
            <div
              onClick={() => handleRemoveOption(index)}
              className="removeicon"
            >
              ✖
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <CustomTextField
              label=""
              name={`option${option.opID}`}
              placeholder="Enter option text"
              value={option.opText}
              onChange={(e) =>
                handleOptionChange(index, "opText", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    )),
    <button type="button" className="Addbtn" onClick={handleAddOption}>
      Add Option
    </button>,

    optionFields.length < 2 && isSaveClicked && (
      <div className="text-danger" style={{ fontSize: "15px" }}>
        Select at least two options, including one correct.
      </div>
    ),
  ];

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <h1 className="text-center my-4 fs-3 page-title">Questions</h1>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <div className="text-end d-block mb-4">
            <CustomOffcanvas
              btnText="Add Question"
              headtitle="Add Question"
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

export default Question;
