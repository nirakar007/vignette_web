import { motion } from "framer-motion";
import React from "react";
import { FaListUl, FaUserCircle } from "react-icons/fa";
import { MdAdd, MdLock, MdNotes, MdSearch } from "react-icons/md";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
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
          <div className="text-center text-sm md:text-base">
            <button className="mb-4">🌙</button>
            <br />
            <button>🔧</button>
          </div>
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
          <div className="text-lg font-bold">Hey! User, What's New Today?</div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search Board..."
              className="border-b hover:border-logo px-4 py-2 focus:border-b-2 focus:outline-none w-full max-w-xs transition-all duration-300"
            />
            <button>
              <MdSearch className="text-xl" />
            </button>
            <div className="flex items-center space-x-4">
              <span>Nirakar</span>
              <FaUserCircle className="text-2xl text-gray-700" />
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-grow">
          {/* Left Panel */}
          <div className="flex flex-col p-4 space-y-4 w-full md:w-2/3">
            {/* Notebooks Section */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Blank Notebook */}
              <motion.div
                className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow"
                whileHover={{ scale: 1.05 }}
              >
                <MdAdd className="text-4xl text-black mb-4" />
                <h3 className="font-bold text-lg">Blank Notebook</h3>
                <p className="text-sm text-gray-500">
                  Create a Simple Notebook
                </p>
              </motion.div>
              {/* Private Notes */}
              <motion.div
                className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow"
                whileHover={{ scale: 1.05 }}
              >
                <MdLock className="text-4xl text-black mb-4" />
                <h3 className="font-bold text-lg">Private Notes</h3>
                <p className="text-sm text-gray-500">Only Accessible to you</p>
              </motion.div>
              {/* Class Notes */}
              <motion.div
                className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow"
                whileHover={{ scale: 1.05 }}
              >
                <FaListUl className="text-4xl text-black mb-4" />
                <h3 className="font-bold text-lg">Class Notes</h3>
                <p className="text-sm text-gray-500">Use a Template</p>
              </motion.div>
            </motion.div>

            {/* Tabs */}
            <section className="px-1 py-2 bg-gray-100 flex justify-start space-x-4">
              <motion.button
                className="px-4 py-2 bg-black text-white rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                Recents
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                Favourites
              </motion.button>
            </section>

            {/* Last Viewed Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">Last Viewed</h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg shadow p-4 space-y-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-gray-200 h-32 w-full rounded"></div>
                      <h3 className="font-bold text-sm">Business Cards</h3>
                      <p className="text-xs text-gray-500">
                        12/9/2024 11:08 PM
                      </p>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <button>📤</button>
                        <button>🗑️</button>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </div>

          {/* Right Panel */}
          <motion.div
            className="bg-black text-white flex flex-col items-center justify-center p-6 w-full md:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="font-bold text-xl mb-4 text-center">
              Notes Sharing <br />
              Join the Community!
            </h2>
            <div className="bg-gray-600 w-full h-64 rounded"></div>
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
  );
};

export default Dashboard;
