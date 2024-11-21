import React, { useEffect, useState } from "react";
import { CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomOffcanvas from "../../Components/CustomOffcanvas/CustomOffcanvas";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import CustomTextArea from "../../Components/CustomTextArea/CustomTextArea";
import CustomSelectField from "../../Components/CustomSelectField/CustomSelectField";
import * as Yup from "yup";

function Topic() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    createdBy: "66bfb7732db2ae3a35fb5617",
    subjects: [],
  });

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, "Topic name must be at least 5 characters")
      .max(100, "Topic name cannot exceed 100 characters")
      .required("Topic name is required"),
    description: Yup.string().optional(),
    subjects: Yup.array()
      .min(1, "Subject is required")
      .required("Subjects are required"),
  });

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/topics`);
      const result = await response.json();
      setTopics(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching Topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, []);

  const validateField = async (name, value) => {
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationError.message,
      }));
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
      validateField(name, selectedValues);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/topics/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Saved data:", result);
      fetchTopics();
      setShowOffcanvas(false);
      setSuccessMessage("Topic added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);

      setFormData({
        name: "",
        description: "",
        createdBy: "66bfb7732db2ae3a35fb5617",
        subjects: [],
      });
      setErrors({});
    } catch (error) {
      if (error.name === "ValidationError") {
        const formErrors = {};
        error.inner.forEach((err) => {
          formErrors[err.path] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Error creating topic:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/topics/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Deleted subject with id: ${id}`);
        setSuccessMessage("Topic deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
        fetchTopics();
      } else {
        console.error("Error deleting topic:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const generateRows = () => {
    if (!Array.isArray(topics)) return [];

    return topics.map((topic) => ({
      name: topic.name,
      subject:
        topic?.subjects?.map((subject) => subject?.name).join(", ") || "N/A",
      createdAt: topic.createdAt
        ? new Date(topic.createdAt).toLocaleString()
        : "N/A",
      actions: (
        <RiDeleteBin6Line
          className="text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(topic._id)}
        />
      ),
    }));
  };

  const data = () => {
    return {
      columns: [
        {
          label: "Subject Name",
          field: "subject",
          sort: "disabled",
          width: 270,
        },
        { label: "Topic Name", field: "name", sort: "disabled", width: 150 },

        {
          label: "Created At",
          field: "createdAt",
          sort: "disabled",
          width: 200,
        },
        { label: "Action", field: "actions", sort: "disabled", width: 100 },
      ],
      rows: generateRows(),
    };
  };

  if (loading) return <p>Loading...</p>;

  const fields = [
    <CustomTextField
      label={
        <span>
          Topic Name
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="name"
      placeholder="Enter Topic Name"
      value={formData.name}
      onChange={handleInputChange}
      error={errors.name}
      className={`form-control ${errors.name ? "is-invalid" : ""}`}
    />,
    <CustomSelectField
      label={
        <span>
          Subject(s)
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      name="subjects"
      placeholder="Choose Subjects"
      multiple={true}
      options={subjects}
      onChange={handleInputChange}
      value={formData.subjects}
      error={errors.subjects}
      className={`form-control ${errors.subjects ? "is-invalid" : ""}`}
    />,
    <CustomTextArea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      error={errors.description}
      className={`form-control ${errors.description ? "is-invalid" : ""}`}
    />,
  ];

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <h1 className="text-center my-4 fs-3 page-title">Topics</h1>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <div className="text-end d-block mb-4">
            <CustomOffcanvas
              btnText="Add Topics"
              headtitle="Add Topic"
              fields={fields}
              onSubmit={handleSave}
              show={showOffcanvas}
              setShow={setShowOffcanvas}
            />
          </div>

          <div>
            <CDBCard>
              <CDBCardBody className="p-4">
                <CDBDataTable
                  striped
                  bordered
                  hover
                  entriesOptions={[5, 20, 25]}
                  entries={5}
                  pagesAmount={4}
                  data={data()}
                  materialSearch={true}
                  style={{ marginTop: "15px" }}
                />
              </CDBCardBody>
            </CDBCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topic;
