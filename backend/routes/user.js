const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploads");

const {
  getUsers,
  register,
  login,
  logout,
  updateUser,
  deleteUser,
  uploadImage,
  getMe,
} = require("../controllers/user");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAllUsers", protect, getUsers);
router.put("/updateUser/:id", protect, updateUser);
router.delete("/deleteUser/:id", protect, deleteUser);
router.get("/getMe", protect, getMe);

module.exports = router;
