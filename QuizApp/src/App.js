import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Pages/Login/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Subject from "./Pages/Subject/Subject";
import User from "./Pages/User/User";
import Question from "./Pages/Question/Question";
import Topic from "./Pages/Topic/Topic";
import Test from "./Pages/Test/Test";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Signup from "./Pages/Signup/Signup";
import Exam from "./Pages/Exam/Exam";
import Result from "./Pages/Result/Result.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

function App() {
  const [user, setUser] = useState("");
  // useEffect(()=>{
  //     const getUser = async () => {
  //       let response = await fetch(`${process.env.REACT_APP_API_HOST}users`)
  //       const data = await response.json()
  //       setUser(data.data)
  //     }
  //     getUser();
  //   },[])
  //   console.log(process.env.REACT_APP_API_HOST, user);

  const routerUser = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/subject",
      element: <Subject />,
    },
    {
      path: "/user",
      element: <User />,
    },
    {
      path: "/question",
      element: <Question />,
    },
    {
      path: "/topic",
      element: <Topic />,
    },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "/result",
      element: <Result />,
    },
    {
      path: "/exam",
      element: <Exam />,
    },
    {
      path: "/dashboard",
      element: <Dashboard/>,
    },
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);
  const routerAdmin = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/subject",
      element: <Subject />,
    },
    {
      path: "/user",
      element: <User />,
    },
    {
      path: "/question",
      element: <Question />,
    },
    {
      path: "/topic",
      element: <Topic />,
    },
    {
      path: "/test",
      element: <Test />,
    },

    {
      path: "/",
      element: <LandingPage />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={routerUser} />
    </div>
  );
}

export default App;