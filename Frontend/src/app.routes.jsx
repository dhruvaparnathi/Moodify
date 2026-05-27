import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Home from "./Features/Home/components/Home.jsx";
import Register from "./Features/Auth/pages/Register.jsx";
import Login from "./Features/Auth/pages/Login.jsx";
import NotFound from "./Features/shared/components/NotFound.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);
