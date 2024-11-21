import React, { useEffect, useState } from "react";
import { CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import { RiDeleteBin6Line } from "react-icons/ri";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import CustomOffcanvas from "../../Components/CustomOffcanvas/CustomOffcanvas";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import * as Yup from "yup";
import { Formik } from "formik";

function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/subjects`
      );
      const result = await response.json();
      setSubjects(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching Subjects:", error);
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/subjects/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Deleted subject with id: ${id}`);
        setSuccessMessage("Subject deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
        fetchSubjects();
      } else {
        console.error("Error deleting subject:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const generateRows = () => {
    if (!Array.isArray(subjects)) return [];

    return subjects.map((subject) => ({
      name: subject.name,
      code: subject.code,
      actions: (
        <RiDeleteBin6Line
          className="text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(subject._id)}
        />
      ),
    }));
  };

  const data = {
    columns: [
      {
        label: "Subject Name",
        field: "name",
        sort: "disabled",
        width: 150,
      },
      {
        label: "Subject Code",
        field: "code",
        sort: "disabled",
        width: 270,
      },
      {
        label: "Action",
        field: "actions",
        sort: "disabled",
        width: 100,
      },
    ],
    rows: generateRows(),
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Subject name must be at least 3 characters")
      .max(30, "Subject name cannot exceed 30 characters")
      .required("Subject name is required"),
    code: Yup.string()
      .min(2, "Subject code must be at least 2 characters")
      .max(10, "Subject code cannot exceed 10 characters")
      .required("Subject code is required"),
  });

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <h1 className="text-center my-4 fs-3 page-title">Subjects</h1>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <div className="text-end d-block mb-4">
            <Formik
              initialValues={{ name: "", code: "" }}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={async (values, { resetForm, setErrors }) => {
                try {
                  const response = await fetch(
                    `${process.env.REACT_APP_API_HOST}/subjects/add`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(values),
                    }
                  );

                  if (response.ok) {
                    await fetchSubjects();
                    resetForm();
                    setSuccessMessage("Subject added successfully!");
                    setTimeout(() => setSuccessMessage(""), 2000);
                    setShowOffcanvas(false);
                  } else {
                    const errorData = await response.json();
                    if (
                      errorData?.message &&
                      errorData.message.includes("E11000 duplicate key error")
                    ) {
                      setErrors({ code: "Subject code already exists" });
                    } else {
                      console.error(
                        "Error saving subject:",
                        response.statusText
                      );
                    }
                  }
                } catch (error) {
                  console.error("Error saving subject:", error);
                }
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  <CustomOffcanvas
                    show={showOffcanvas}
                    setShow={setShowOffcanvas}
                    btnText="Add Subject"
                    headtitle="Add Subject"
                    fields={[
                      <CustomTextField
                        label={
                          <span>
                            Subject Name
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Enter Subject Name"
                        value={values.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        error={touched.name && errors.name}
                        className={
                          touched.name && errors.name ? "is-invalid" : ""
                        }
                      />,
                      <CustomTextField
                        label={
                          <span>
                            Subject Code
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Enter Subject Code"
                        value={values.code}
                        onChange={handleChange("code")}
                        onBlur={handleBlur("code")}
                        error={touched.code && errors.code}
                        className={
                          touched.code && errors.code ? "is-invalid" : ""
                        }
                      />,
                    ]}
                    onSubmit={handleSubmit}
                  />
                </form>
              )}
            </Formik>
          </div>
          <div className="">
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
    </div>
  );
}

export default Subject;
