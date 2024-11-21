import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./LeftSidebar.scss";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import logo from "../../Assets/logo.png";

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.user.userId);
  const userRole = useSelector((state) => state.user.role);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else if (
      (userRole === "user" &&
        ["/user", "/subject", "/topic", "/question"].includes(
          location.pathname
        )) ||
      (userRole === "admin" &&
        ["/exam", "/test", "/result"].includes(location.pathname))
    ) {
      navigate("/login");
    }
  }, [userId, userRole, location.pathname, navigate]);

  return (
    <CDBSidebar textColor="#333" backgroundColor="#fff;">
      <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
        {" "}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle me-2"
            style={{
              width: "35px",
              height: "35px",
            }}
          />
          Online Quiz
        </Navbar.Brand>{" "}
      </CDBSidebarHeader>
      <CDBSidebarContent>
        <CDBSidebarMenu>
          {userId ? (
            userRole === "user" ? (
              <>
                <NavLink
                  to={"/exam"}
                  className={({ isActive }) =>
                    isActive ? "activeClicked" : ""
                  }
                >
                  <CDBSidebarMenuItem icon="question-circle">
                    Exam
                  </CDBSidebarMenuItem>
                </NavLink>
              </>
            ) : userRole === "admin" ? (
              <>
                <NavLink
                  to={"/user"}
                  className={({ isActive }) =>
                    isActive ? "activeClicked" : ""
                  }
                >
                  <CDBSidebarMenuItem icon="list-alt">Users</CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  to={"/subject"}
                  className={({ isActive }) =>
                    isActive ? "activeClicked" : ""
                  }
                >
                  <CDBSidebarMenuItem icon="book">Subjects</CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to={"/topic"}
                  className={({ isActive }) =>
                    isActive ? "activeClicked" : ""
                  }
                >
                  <CDBSidebarMenuItem icon="list-alt">
                    Topics
                  </CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to={"/question"}
                  className={({ isActive }) =>
                    isActive ? "activeClicked" : ""
                  }
                >
                  <CDBSidebarMenuItem icon="question-circle">
                    Questions
                  </CDBSidebarMenuItem>
                </NavLink>
              </>
            ) : null
          ) : (
            <div>Please log in</div>
          )}
        </CDBSidebarMenu>
      </CDBSidebarContent>
    </CDBSidebar>
  );
}

export default LeftSidebar;
