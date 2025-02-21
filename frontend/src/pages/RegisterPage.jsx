import axios from "axios";
import React, { useState } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import InputField from "../components/shared/InputField";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store token and navigate to dashboard after successful registration
      localStorage.setItem("token", response.data.token);
      navigate("/sign-in");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex flex-col justify-center md:flex-row overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-purple-300/20 rounded-full blur-3xl -top-32 -left-32 animate-blob"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl top-1/2 -right-32 animate-blob animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] bg-teal-300/30 rounded-full blur-3xl -bottom-32 left-1/4 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Panel */}
      <div className="flex z-10 bg-white flex-col justify-center items-start p-8 md:px-20 backdrop:blur-md rounded-md">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-black">
          Get Started Now
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white"
        >
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <InputField
            placeholder="Enter your username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            placeholder="Re-enter your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="w-4 h-4" required />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the terms & policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800"
          >
            Signup
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm mb-4">Or</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <FcGoogle />
                <span className="ml-2 text-sm">Sign in with Google</span>
              </button>
              <button className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <FaApple />
                <span className="ml-2 text-sm">Sign in with Apple</span>
              </button>
            </div>
            <p className="mt-6 text-gray-500">
              Have an account?{" "}
              <span
                onClick={() => navigate("/sign-in")}
                className="text-black font-semibold px-2 cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
