import "./Login.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserId, setUserRole } from "../../store/userSlice";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import CustomPasswordField from "../../Components/CustomPasswordField/CustomPasswordField";
import CustomBtn from "../../Components/CustomBtn/CustomBtn";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    userName: "",
    password: "",
  });

  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (e.target.id === "userName" && fieldErrors.userName) {
      setFieldErrors((prev) => ({ ...prev, userName: "" }));
    }

    if (e.target.id === "password" && fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!formData.userName) {
      validationErrors.userName = "Username is required";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    const loginUser = {
      userName: formData.userName,
      password: formData.password,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/login`, {
        method: "POST",
        body: JSON.stringify(loginUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const result = await response.json();
      const { userName, _id, role } = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({ userName, userId: _id, role })
      );

      dispatch(setUserId(_id));
      dispatch(setUserRole(role));
      setFormData({ userName: "", password: "" });

      if (role === "admin") {
        navigate("/user");
      } else if (role === "user") {
        navigate("/exam");
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="login_page">
      <div className="login_content">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <CustomTextField
            id="userName"
            label={
              <span>
                Username
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            value={formData.userName}
            onChange={changeHandler}
            placeholder="Type your username"
            error={fieldErrors.userName}
          />

          <CustomPasswordField
            id="password"
            label={
              <span>
                Password
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              </span>
            }
            value={formData.password}
            onChange={changeHandler}
            placeholder="Type your password"
            error={fieldErrors.password}
          />

          {apiError && (
            <div className="error-message text-danger">{apiError}</div>
          )}

          <a
            className="d-flex justify-content-end fw-bold text-dark"
            href="javascript:void(0)"
          >
            Forgot Password
          </a>

          <div className="login_btn_wrap">
            <CustomBtn type="submit" btnText="Login" />
          </div>

          <Link
            to={"/signup"}
            className="d-flex justify-content-center fw-bold text-dark signup_text"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
