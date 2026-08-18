import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthPage from "./components/AuthPage.jsx";
import HomePage from "./components/HomePage.jsx";
import GamePage from "./components/GamePage.jsx";
import SavedGamesPage from "./components/SavedGamesPage.jsx";
import UserPage from "./components/UserPage.jsx";
import ErrorPage from "./components/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "game",
        element: <GamePage />,
      },
      {
        path: "game/saved",
        element: <SavedGamesPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;