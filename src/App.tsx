import "./App.css";
import EvictionForm from "./EvictionForm";
import FrontPage from "./FrontPage";
import NameAndGenderForm from "./NameAndGenderForms";
import { Outlet, useRoutes } from "react-router-dom";

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
      ],
    },
  ]);
  return routedPages;
}
