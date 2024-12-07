import React, { lazy } from "react";
const Home = lazy(() => import("../pages/home"))

function Router() {
  //login logic
  // login verify
  // lazy loading - prevent unnecessary page loads
  const token = false;
  const privateRouter = [];

  const publicRouter = [
    {path: "/", element: <Home/>},
    // {path: "/login", element: }
  ]

  const router = token ? privateRouter : publicRouter;

  return <div>Router</div>;
}

export default Router;
