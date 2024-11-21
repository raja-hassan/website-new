import React, { useState, useEffect } from "react";
import { CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomOffcanvas from "../../Components/CustomOffcanvas/CustomOffcanvas";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import CustomEmailField from "../../Components/CustomEmailField/CustomEmailField";
import * as Yup from "yup";

function User() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userName: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name must not exceed 30 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    userName: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must not exceed 20 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.id]: "",
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();

    let formErrors = {}; // Collect errors

    try {
      // Validate form data using Yup
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      // Collect all Yup validation errors
      validationError.inner.forEach((err) => {
        formErrors[err.path] = err.message;
      });
    }

    // Check for duplicate username and email errors
    const isUsernameTaken = users.some(
      (user) => user.userName === formData.userName
    );
    const isEmailTaken = users.some((user) => user.email === formData.email);

    if (isUsernameTaken) {
      formErrors.userName = "Username already exists";
    }
    if (isEmailTaken) {
      formErrors.email = "Email already exists";
    }

    // Update errors state and stop submission if there are errors
    if (Object.keys(formErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, ...formErrors })); // Merge with existing errors
      return;
    }

    // Proceed with user creation if no errors
    try {
      const newUser = { ...formData };

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/users/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: errorData?.message || "Error saving user",
        }));
        return;
      }

      const result = await response.json();

      // Add the new user to the state and reset the form
      setUsers((prevUsers) => [...prevUsers, { ...newUser, _id: result._id }]);
      setFormData({
        name: "",
        email: "",
        userName: "",
        password: "",
        role: "",
      });
      setErrors({});
      setShowOffcanvas(false);
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/users`);
      const result = await response.json();
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching Users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid ID: cannot delete user");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Deleted subject with id: ${id}`);
        setSuccessMessage("User deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
        fetchUsers();
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const generateRows = () => {
    return users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      actions: (
        <RiDeleteBin6Line
          className="text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(user._id)}
        />
      ),
    }));
  };

  const data = {
    columns: [
      { label: "UserName", field: "name", sort: "disabled", width: 150 },
      { label: "Email", field: "email", sort: "disabled", width: 270 },
      { label: "Role", field: "role", sort: "disabled", width: 200 },
      { label: "Action", field: "actions", sort: "disabled", width: 100 },
    ],
    rows: generateRows(),
  };

  const fields = [
    <CustomTextField
      id="name"
      label={
        <span>
          Name
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      placeholder="Enter name"
      value={formData.name}
      onChange={changeHandler}
      error={errors.name}
      className={errors.name ? "is-invalid" : ""}
    />,
    <CustomEmailField
      id="email"
      type="email"
      label={
        <span>
          Email
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      placeholder="Enter email"
      value={formData.email}
      onChange={changeHandler}
      error={errors.email}
      className={errors.email ? "is-invalid" : ""}
    />,
    <CustomTextField
      id="userName"
      type="text"
      label={
        <span>
          Username
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      placeholder="Enter user name"
      value={formData.userName}
      onChange={changeHandler}
      error={errors.userName}
      className={errors.userName ? "is-invalid" : ""}
    />,
    <CustomTextField
      id="password"
      type="password"
      label={
        <span>
          Password
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        </span>
      }
      placeholder="Enter password"
      value={formData.password}
      onChange={changeHandler}
      error={errors.password}
      className={errors.password ? "is-invalid" : ""}
    />,
    <div className="form-group">
      <label style={{ fontWeight: 700 }} htmlFor="role">
        Role<span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </label>

      <select
        id="role"
        value={formData.role}
        onChange={changeHandler}
        className={`form-control ${errors.role ? "is-invalid" : ""}`}
      >
        <option value="">Select Role</option>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>
      {errors.role && <p className="text-danger">{errors.role}</p>}
    </div>,
  ];

  return (
    <div className="container-fluid">
      <div className="page-wrapper">
        <LeftSidebar />
        <div className="right-side-content">
          <h1 className="text-center my-4 fs-3 page-title">Users</h1>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <div className="text-end d-block mb-4">
            <CustomOffcanvas
              btnText="Add User"
              headtitle="New User"
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

export default User;
