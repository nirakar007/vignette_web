import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/private_pages/Dashboard";
import MainCanvas from "../pages/private_pages/MainCanvas";
import RegisterPage from "../pages/RegisterPage";

const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/sign-in", element: <LoginPage /> },
  { path: "/sign-up", element: <RegisterPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/main-canvas", element: <MainCanvas /> },
];

export default function TheRouter() {
  return (
    <div className="flex flex-col">
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
}
