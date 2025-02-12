import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import ChatApp from "./pages/ChatApp.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import { Signin } from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <Signin />,
      },
      {
        path: "/sign-up/*",
        element: <Signup />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashBoard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatApp />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
