import axios from "axios";
import { motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";
import { FaListUl, FaUserCircle } from "react-icons/fa";
import { MdAdd, MdLock, MdLogout, MdNotes, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

// Create a context for notebook actions
const NotebookContext = createContext();

const NotebookProvider = ({ children }) => {
  const [selectedNotebook, setSelectedNotebook] = useState("");
  const navigate = useNavigate();

  const handleNotebookClick = (notebook) => {
    setSelectedNotebook(notebook);
    navigate("/main-canvas", { state: { notebook } });
  };

  return (
    <NotebookContext.Provider value={{ selectedNotebook, handleNotebookClick }}>
      {children}
    </NotebookContext.Provider>
  );
};

const Dashboard = () => {
  const [name, setName] = useState();
  const { logout, user } = useContext(AuthContext); // Get user info & logout function
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found!");
          return; // You can handle redirect to login page here
        }

        // Send the token in the Authorization header
        const response = await axios.get(
          "http://localhost:5000/api/v1/auth/getMe",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setName(response.data.data.name); // Set the username from the response
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response.data.message || error.message
        );
      }
    };

    fetchUser();
  }, []);

  return (
    <NotebookProvider>
      <div className="flex bg-gray-100">
        {/* Sidebar */}
        <aside className="bg-black text-white w-16 md:w-20 flex flex-col items-center py-6">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <img
                src="/src/assets/logo/logo.svg"
                alt="Logo"
                className="h-12 w-12"
              />
            </div>
          </motion.div>
          <motion.nav
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaUserCircle className="text-xl md:text-2xl cursor-pointer" />
            <MdNotes className="text-xl md:text-2xl cursor-pointer" />
            <div className="flex-grow"></div>

            {/* Logout Button */}
            <motion.button
              className="text-xl md:text-2xl cursor-pointer hover:text-red-500 transition-all"
              onClick={() => {
                logout();
                navigate("/"); // Redirect to login page after logout
              }}
            >
              <MdLogout />
            </motion.button>
          </motion.nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          {/* Header */}
          <motion.header
            className="flex justify-between items-center px-6 py-4 bg-white shadow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-lg font-medium">
              Hey {name}! What's New Today?
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search Board..."
                className="border-b hover:border-logo px-4 py-2 focus:border-b-2 focus:outline-none w-full max-w-xs transition-all duration-300"
              />
              <button>
                <MdSearch className="text-xl" />
              </button>
            </div>
          </motion.header>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-grow">
            {/* Left Panel */}
            <div className="flex flex-col p-4 space-y-4 w-full md:w-2/3">
              <NotebookGrid />
            </div>

            {/* Right Panel */}
            <motion.div
              className="bg-black text-white flex flex-col items-center p-6 w-full md:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="font-bold text-xl m-4 text-center">
                Notes Sharing <br />
                Join the Community!
              </h2>
              <div className="bg-gray-100 w-full p-4 h-64 rounded">
                <img
                  src="/src/assets/images/dashboard_community.svg"
                  alt="Community"
                />
              </div>
              <motion.button
                className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </main>
      </div>
    </NotebookProvider>
  );
};

// Component for rendering the notebook grid
const NotebookGrid = () => {
  const { handleNotebookClick } = useContext(NotebookContext);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {/* Blank Notebook */}
      <motion.div
        className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={() => handleNotebookClick("Blank Notebook")}
      >
        <MdAdd className="text-4xl text-black mb-4" />
        <h3 className="font-bold text-lg">Blank Notebook</h3>
        <p className="text-sm text-gray-500">Create a Simple Notebook</p>
      </motion.div>

      {/* Private Notes */}
      <motion.div
        className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={() => handleNotebookClick("Private Notes")}
      >
        <MdLock className="text-4xl text-black mb-4" />
        <h3 className="font-bold text-lg">Private Notes</h3>
        <p className="text-sm text-gray-500">Only Accessible to you</p>
      </motion.div>

      {/* Class Notes */}
      <motion.div
        className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={() => handleNotebookClick("Class Notes")}
      >
        <FaListUl className="text-4xl text-black mb-4" />
        <h3 className="font-bold text-lg">Class Notes</h3>
        <p className="text-sm text-gray-500">Use a Template</p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
