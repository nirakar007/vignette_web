import React, { useState } from "react";
import RightPanelImage from "../assets/images/signup-picture.png";
import InputField from "../components/InputField";

const Register = ({ toggleScreen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration data:", { name, email, password });
  };

  return (
    <div
      className="h-screen w-screen flex flex-col md:flex-row overflow-hidden"
      style={{ overflowX: "hidden" }}
    >
      {/* Left Panel */}
      <div className="flex-1 bg-white flex flex-col justify-center items-start px-8 md:px-20">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-black">
          Get Started Now
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white"
        >
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
            type="text"
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
          <InputField placeholder="Re-enter your password" type="password" />
          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="w-4 h-4" />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the terms & policy
            </label>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Signup
          </button>
          {/* Sign-in Options */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm mb-4">Or</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                <span className="ml-2 text-sm">Sign in with Google</span>
              </button>
              <button className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <img src="/apple-icon.png" alt="Apple" className="w-5 h-5" />
                <span className="ml-2 text-sm">Sign in with Apple</span>
              </button>
            </div>
            <p className="mt-6 text-gray-500">
              Have an account?{" "}
              <a href="#" className="text-black font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-black flex flex-col justify-center items-center relative overflow-hidden">
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

export default Register;
