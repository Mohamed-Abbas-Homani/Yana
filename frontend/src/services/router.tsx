import { createBrowserRouter } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";
import CreateNotePage from "../pages/CreateNotePage";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/note",
    element: <CreateNotePage />,
  },
  {
    path: "/note/:id",
    element: <CreateNotePage />,
  },
]);

export default router;
