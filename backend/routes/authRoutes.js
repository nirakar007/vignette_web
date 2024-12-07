import { Router } from "express";
import { register, login } from "../controller/authController.js";
import { getAllUsers, getUserById } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// register
router.post("/register", register);
// login
router.post("/login", login);
// get all users
router.get("/getAllUsers", authMiddleware, getAllUsers);
// get users by id
router.get("/getUserById", authMiddleware, getUserById);

export default router;
