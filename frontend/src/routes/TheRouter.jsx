import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/private_pages/Dashboard";
import RegisterPage from "../pages/RegisterPage";

const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/sign-in", element: <LoginPage /> },
  { path: "/sign-up", element: <RegisterPage /> },
  { path: "/dashboard", element: <Dashboard /> },
];

export default function TheRouter() {
  return (
    <div className="flex flex-col">
      {/* <Navbar /> */}
      <div className="flex flex-col">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}
