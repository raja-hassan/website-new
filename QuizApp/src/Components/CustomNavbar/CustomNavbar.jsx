import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserId, setUserRole } from "../../store/userSlice";
import logo from "../../Assets/logo.png";

function CustomNavbar() {
  const userId = useSelector((state) => state.user.userId);
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUserId(null));
    dispatch(setUserRole(null));
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleGetStarted = () => {
    if (!userId) {
      navigate("/login");
    } else {
      navigate(role === "user" ? "/exam" : "/user");
    }
  };

  return (
    <Navbar
      expand="lg"
      className="border-bottom"
      style={{
        background:
          "linear-gradient(to right, rgb(247, 167, 182), rgb(194, 163, 241))",
      }}
      fixed="top"
    >
      <Container fluid style={{ maxWidth: "1140px" }}>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle me-2"
            style={{
              width: "40px",
              height: "40px",
            }}
          />
          Online Quiz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-nav ms-auto mb-2 mb-lg-0">
            {userId && (
              <Nav.Item>
                <Nav.Link href={role === "user" ? "/exam" : "/user"}>
                  {role === "user" ? (
                    <button className="btn btn-secondary">Start Exam</button>
                  ) : (
                    <></>
                  )}
                </Nav.Link>
              </Nav.Item>
            )}

            {userId ? (
              <Nav.Item>
                <Nav.Link onClick={handleLogout}>
                  <button className="btn btn-danger">Logout</button>
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Nav.Link onClick={handleGetStarted}>
                  <button className="btn btn-primary">Get Started</button>
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
