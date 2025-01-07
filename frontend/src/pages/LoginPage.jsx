import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const LoginPage = ({ toggleScreen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", { email, password });
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Welcome to <span className="text-neutral-600">Vignette</span>
        </h1>
        <h2 className="text-lg text-gray-600 text-center m-16">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-b rounded-lg focus:ring-2 focus:ring-neutral-600 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-b rounded-lg focus:ring-2 focus:ring-neutral-600 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Not a user?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-neutral-600 hover:underline"
          >
            Register
          </button>
        </p>
        <div className="flex justify-center mt-6">
          <button className="mx-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full">
            G
          </button>
          <button className="mx-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full">
            F
          </button>
          <button className="mx-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full">
            A
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
