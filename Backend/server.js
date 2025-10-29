
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; // Import helmet
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODBURL = process.env.MONGODB_URI;

// Use Helmet BEFORE defining routes
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Database connection and server start
mongoose
  .connect(MONGODBURL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Something went wrong!",
  });
});
