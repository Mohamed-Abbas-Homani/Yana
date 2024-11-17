import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./services/router";
import useStartUp from "./hooks/useStartUp";


const App: React.FC = () => {
  useStartUp();
  return <RouterProvider router={router} />;
};

export default App;
