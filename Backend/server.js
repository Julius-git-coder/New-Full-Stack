import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js"; // Auth routes
import userRoutes from "./routes/userRoutes.js"; // User routes (commented for now)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODBURL = process.env.MONGODB_URI;

console.log("Full server loaded");

// Helmet for security
app.use(helmet());
console.log("Helmet applied");

// CORS for frontend
app.use(cors({ origin: true, credentials: true }));
console.log("CORS applied");

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("Body parsers applied");

// Mount auth routes (public)
app.use("/api/auth", authRoutes);
console.log("Auth routes mounted at /api/auth");

// Mount user routes (protected - commented for now)
app.use("/api", userRoutes);
console.log("User routes mounted at /api");

// Root route
app.get("/", (req, res) => {
  console.log("Root route HIT!");
  res.send("Server is working!");
});

// API test route
app.get("/api/test", (req, res) => {
  console.log("API test route HIT!");
  res.json({ message: "API test working with full setup!" });
});

// DB connect
mongoose
  .connect(MONGODBURL)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB error:", error);
  });

// Basic 404
app.use((req, res) => {
  console.log(`404 for ${req.method} ${req.url}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});
