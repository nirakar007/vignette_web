import { Router } from "express";
import { register, login } from "../controller/authController.js";

const router = Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

export default router;
