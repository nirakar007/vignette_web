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

// // Element routes
// router.post("/boards/:boardId/elements", protect, async (req, res) => {
//   try {
//     const element = await Element.create({
//       ...req.body,
//       board: req.params.boardId,
//     });
//     res.status(201).json(element);
//   } catch (err) {
//     res.status(400).json({ message: "Element creation failed" });
//   }
// });

// // File upload route
// router.post(
//   "/boards/:boardId/upload",
//   protect,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       const fileUrl = `/uploads/${req.file.filename}`;
//       res.status(201).json({ url: fileUrl });
//     } catch (err) {
//       res.status(500).json({ message: "Upload failed" });
//     }
//   }
// );

// // PDF specific route
// router.post(
//   "/boards/:boardId/pdf",
//   protect,
//   upload.single("pdf"),
//   async (req, res) => {
//     try {
//       const pdfUrl = `/uploads/${req.file.filename}`;
//       res.status(201).json({ url: pdfUrl });
//     } catch (err) {
//       res.status(500).json({ message: "PDF upload failed" });
//     }
//   }
// );

// Upload endpoint
router.post(
  "/boards/:boardId/upload",
  upload.single("file"), // Use multer middleware
  async (req, res) => {
    try {
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Save endpoint
router.put("/boards/:boardId", async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.boardId,
      { content: req.body.content },
      { new: true }
    );
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

module.exports = router;
