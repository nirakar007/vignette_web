import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden bg-primary text-black min-h-screen relative">
      <div className="z-10">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center p-14 z-10">
        <motion.h1
          className="text-4xl md:text-6xl text-neutral-500 font-light mb-4"
          initial={{ y: -10, opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Infinity, // Makes the animation loop
            repeatType: "reverse", // Makes it alternate direction
          }}
        >
          Welcome to <span className="text-logo font-bold">Vignette</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Capture, organize, and share your notes effortlessly. Designed to help
          you remember everything that matters.
        </motion.p>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={() => navigate("/register")}
            className="py-3 px-6 border-b-8 hover:border-lime-400 border-neutral-200 hover:scale-110 bg-white rounded-lg hover:bg-black-500 hover:text-black transition duration-300 z-10"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("#features")}
            className="py-3 px-6 text-white bg-neutral-800 rounded-lg hover:bg-gray-600 transition duration-300 z-10"
          >
            Learn More
          </button>
        </motion.div>

        {/* Animated Background Circle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* <div className="h-96 w-96 rounded-full bg-gray-800 blur-3xl opacity-20" /> */}
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-t-2 py-20 bg-white text-black text-center px-6"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Features
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Explore the powerful tools designed to help you create, organize, and
          manage your notes.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Fast", "Secure", "Organized"].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white-700 border-b-8 rounded-lg shadow-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-400">
                {`Enjoy ${feature.toLowerCase()} performance and reliability.`}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="border-t-blue-200 py-20 bg-white text-black text-center px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Sign up now and take control of your notes and ideas.
        </motion.p>
        <motion.button
          onClick={() => navigate("/sign-up")}
          className="py-3 px-6 bg-white border-b-8 rounded-lg hover:bg-black hover:text-white hover:border-green-200 transition duration-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Create Your Account
        </motion.button>
      </section>
    </div>
  );
};

export default LandingPage;
