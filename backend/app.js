import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/db.js';
import moodBoardRoutes from './routes/moodBoardRoutes.js';
import authRoutes from "./routes/authRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON payloads

// Routes
app.use('/api/moodboards', moodBoardRoutes);
app.use(cors()); // enable cross-origin resource sharing
app.use("/api/auth", authRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
