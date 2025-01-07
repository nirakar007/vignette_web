import React, { useState } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"; // Import for navigation
import RightPanelImage from "../assets/images/signup-picture.png";
import InputField from "../components/shared/InputField";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Simulating user registration (e.g., saving to localStorage or sending to API)
    const userData = { name, email, password };
    localStorage.setItem("user", JSON.stringify(userData));

    // Clear error (if any)
    setError("");

    // Redirect to Login Page
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel */}
      <div className="flex bg-white flex-col justify-center items-start p-8 md:px-20">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-black">
          Get Started Now
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white"
        >
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {/* Name Input */}
          <InputField
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* Email Input */}
          <InputField
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password Inputs */}
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
          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="w-4 h-4" required />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the terms & policy
            </label>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800"
          >
            Signup
          </button>
          {/* Sign-in Options */}
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

      {/* Right Panel */}
      <div className="bg-black flex flex-col justify-center items-center relative overflow-hidden">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 text-center">
          Vignette, <br /> Remember everything!
        </h2>
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src={RightPanelImage}
            alt="Signup Illustration"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
