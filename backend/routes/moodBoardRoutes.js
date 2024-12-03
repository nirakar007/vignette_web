import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js"

import { createMoodBoard, getMoodBoards, getMoodBoardById, updateMoodBoard, deleteMoodBoard } from "../controller/moodBoardController.js";



const router = Router();
router.post("/createMoodBoard", authMiddleware, createMoodBoard);
router.get("/getMoodBoards", authMiddleware, getMoodBoards);
router.get("/getMoodBoardsById/:id", authMiddleware, getMoodBoardById);
router.put("/updateMoodBoard/:id", authMiddleware, updateMoodBoard);
router.post("/deleteMoodBoard/:id", authMiddleware, deleteMoodBoard);

export default router;