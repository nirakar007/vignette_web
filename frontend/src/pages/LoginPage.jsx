import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/shared/InputField";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        username,
        password,
      });

      console.log("Success:", res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative overflow-hidden">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-purple-300/20 rounded-full blur-3xl -top-32 -left-32 animate-blob"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl top-1/2 -right-32 animate-blob animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] bg-teal-300/30 rounded-full blur-3xl -bottom-32 left-1/4 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass-morphism container */}
      <div className="w-full max-w-xs space-y-8 relative z-10 backdrop-blur-lg bg-white/50 rounded-xl shadow-sm p-8 border border-white/20">
        <div className="w-full max-w-xs space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-light text-neutral-800 mb-2">
              Welcome
            </h1>
            <p className="text-sm text-neutral-500">Sign in to continue</p>
          </div>

          <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="text-sm text-rose-600 px-4 py-2 bg-rose-50 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <InputField
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border-b border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
                  autoFocus
                />

                <InputField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border-b border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-neutral-600">
            No account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="font-medium text-neutral-800 hover:text-neutral-600 transition-colors"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Add subtle animated border */}
        <div className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"></div>
      </div>

      {/* Subtle animated grain texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgZmlsbC1vcGFjaXR5PSIuMDEiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIHRleHQtYW5jaG9yPSJtaWRkbGUiPm5vdGVzYXBwPC90ZXh0Pjwvc3ZnPg==')] opacity-10 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};

export default LoginPage;
