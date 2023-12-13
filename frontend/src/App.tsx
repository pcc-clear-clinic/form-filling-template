import React from "react";
import "./App.css";
import EvictionForm from "./EvictionForm";
import FrontPage from "./FrontPage";
import NameAndGenderForm from "./NameAndGenderForms";
import { Outlet, useRoutes } from "react-router-dom";
import TestForm from "./TestForm";

export default function App() {
  const routedPages = useRoutes([
    {
      path: "/",
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <FrontPage />,
        },
        {
          path: "gender",
          element: <NameAndGenderForm />,
        },
        {
          path: "eviction",
          element: <EvictionForm />,
        },
        {
          path: "test",
          element: <TestForm />,
        },
      ],
    },
  ]);
  return routedPages;
}
