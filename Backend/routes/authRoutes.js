import express from "express";
import { signup, login } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Signup (with optional file upload)
router.post("/signup", upload.single("file"), signup);

// Login (JSON only)
router.post("/login", login);

console.log("Full AuthRoutes loaded (with controller)");

export default router;
