
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  downloadFile,
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import verifyToken from "../middleware/authMiddleware.js"; // Add this

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Get all users
router.get("/users", getAllUsers);

// Get single user
router.get("/users/:id", getUserById);

// Create user with file upload
router.post("/users", upload.single("file"), createUser);

// Update user with optional file upload
router.put("/users/:id", upload.single("file"), updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

// Download user's file
router.get("/users/:id/download", downloadFile);

export default router;