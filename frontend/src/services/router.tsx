import { createBrowserRouter } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";
import CreateNotePage from "../pages/CreateNotePage";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";
import SettingsPage from "../pages/SettingsPage";

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
    path: "/settings",
    element: <SettingsPage />,
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
