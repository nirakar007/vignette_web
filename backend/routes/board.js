const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  toggleFavorite,
  getBoardsByUser,
  searchBoards,
  createElement,
  uploadFile,
  processPdf,
  exportBoard,
} = require("../controllers/board");

router.get("/getAllBoards", protect, getBoards);
router.get("/:boardId", protect, getBoard);
router.post("/createBoard", protect, createBoard);
router.put("/:boardId", protect, updateBoard);
router.get("/users/:userId", protect, getBoardsByUser);
router.delete("/:id", protect, deleteBoard);
router.get("/search", protect, searchBoards);
router.patch("/toggleFavorite/:boardId", protect, toggleFavorite);
router.post("/:boardId/elements", protect, createElement); // Use createElement instead of addElementToBoard for consistency
router.post("/:boardId/upload", protect, uploadFile);
router.post("/:boardId/pdf", protect, processPdf);
router.get("/:boardId/export", protect, exportBoard);

// Image upload route
router.post(
  "/:boardId/uploadImage",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardId);
      if (!board) return res.status(404).json({ message: "Board not found" });

      board.elements.push({
        type: "image",
        src: `/uploads/${req.file.filename}`,
        position: { x: 0, y: 0 },
      });

      await board.save();
      res.status(201).json(board);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  }
);

// **Route for saving/updating board content (PUT)**
router.put("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const { content } = req.body; // Assuming content is sent in the request body

  try {
    const board = await Board.findByIdAndUpdate(
      boardId,
      { content },
      { new: true }
    ); // { new: true } to return the updated doc
    if (!board) {
      return res.status(404).json({ message: "Board not found" }); // Handle if boardId is invalid
    }
    res.json(board); // Return the updated board
  } catch (error) {
    console.error("Error updating board content:", error);
    return res.status(500).json({ message: "Error saving board content" });
  }
});

router.get("/search", async (req, res) => {
  const { name } = req.query; // Get the 'name' query parameter

  if (!name) {
    // Basic validation - name is expected for search
    return res
      .status(400)
      .json({ message: "Search 'name' parameter is required." });
  }

  try {
    // **Potential Error Area:** Database query might fail if not handled properly.
    const boards = await Board.find({
      content: { $regex: name, $options: "i" }, // Search content, case-insensitive
    });
    res.json(boards);
  } catch (error) {
    console.error("Error during board search:", error); // Log the error on the server!
    return res
      .status(500)
      .json({ message: "Error fetching boards during search." }); // Send a 500 error with a user-friendly message.
  }
});

module.exports = router;
