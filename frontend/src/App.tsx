import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import router from "./services/router";
import useStartUp from "./hooks/useStartUp";
import useStore from "./services/store";
import { useEffect } from "react";


const App: React.FC = () => {
  useStartUp();
  return <RouterProvider router={router} />;
};

export default App;
