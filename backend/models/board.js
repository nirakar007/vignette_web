const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "image", "sticky", "doodle"], // Add more types as needed
  },
  content: {
    type: String, // For text, image URLs, doodle paths, etc.
    required: true,
  },
  position: {
    x: { type: Number, default: 0 }, // X-coordinate on the canvas
    y: { type: Number, default: 0 }, // Y-coordinate on the canvas
  },
  size: {
    width: { type: Number, default: 100 }, // Width of the element
    height: { type: Number, default: 100 }, // Height of the element
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const boardSchema = new mongoose.Schema({
  boardName: { type: String, required: true, trim: true },
  elements: [elementSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this
  createdAt: { type: Date, default: Date.now }, 
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Board", boardSchema);
