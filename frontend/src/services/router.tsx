import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import CreateNotePage from "../pages/CreateNotePage";

const router = createBrowserRouter([
  {
    path: "/",
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
