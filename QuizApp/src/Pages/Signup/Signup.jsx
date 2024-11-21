import React, { useState } from "react";
import "./Signup.scss";
import CustomEmailField from "../../Components/CustomEmailField/CustomEmailField";
import CustomPasswordField from "../../Components/CustomPasswordField/CustomPasswordField";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import CustomBtn from "../../Components/CustomBtn/CustomBtn";
import { useNavigate, Link } from "react-router-dom";
import { setUserId, setUserRole } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .required("Name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters long")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Password and confirm password must match"
    )
    .required("Confirm Password is required"),
});

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [generalError, setGeneralError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      const newUser = {
        name: values.name,
        email: values.email,
        userName: values.userName,
        password: values.password,
        role: values.role,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (
            result.message.includes("Username already exists") ||
            result.message.includes("Email already exists")
          ) {
            setErrors({ userName: "Username or Email already exists" });
          } else {
            setGeneralError(result.message || "Something went wrong");
          }
        } else {
          const { userName, _id, role } = result.data;

          localStorage.setItem(
            "user",
            JSON.stringify({ userName, userId: _id, role })
          );

          dispatch(setUserId(_id));
          dispatch(setUserRole(role));

          resetForm();
          setGeneralError("");
          navigate("/exam");
        }
      } catch (error) {
        console.error("Error creating user:", error);
        setGeneralError("Something went wrong. Please try again later.");
      }
    },
  });

  return (
    <div className="signup_page">
      <div className="signup_content">
        <h1>Sign Up</h1>
        <form onSubmit={formik.handleSubmit}>
          <CustomTextField
            id="name"
            label={
              <span>
                Name
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            placeholder="Enter name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <CustomTextField
            id="userName"
            label={
              <span>
                UserName
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            placeholder="Type your username"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && formik.errors.userName}
          />

          <CustomEmailField
            id="email"
            label={
              <span>
                Email
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            placeholder="Enter email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          {generalError && !formik.errors.email && (
            <p
              className="text-danger"
              style={{ marginTop: "10px", fontSize: "15px" }}
            >
              {generalError}
            </p>
          )}

          <CustomPasswordField
            id="password"
            label={
              <span>
                Password
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            placeholder="Type your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          <CustomPasswordField
            id="confirmPassword"
            label={
              <span>
                Confirm Password
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />

          <div className="signup_btn_wrap">
            <CustomBtn type="submit" btnText="Register" />
          </div>
          <Link
            to={"/login"}
            className="d-flex justify-content-center fw-bold text-dark login_text"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
