// Backend/controllers/authController.js (no change needed - first save succeeds without ownerId, then update)
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// Signup (first save without ownerId, then update)
export const signup = async (req, res) => {
  try {
    console.log("Full signup hit with body:", req.body);
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new UserModel({
      name,
      email,
      password, // Hashed in schema pre-save
      phone: phone || "",
      address: address || "",
      // ownerId set after first save
    });

    // Optional file upload to Cloudinary
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "users",
              resource_type: "auto",
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        newUser.file = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          filename: req.file.originalname,
        };
        console.log("File uploaded to Cloudinary");
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res
          .status(400)
          .json({ error: "File upload failed", details: uploadError.message });
      }
    }

    await newUser.save();
    newUser.ownerId = newUser._id; // Self-owned
    await newUser.save(); // Update ownerId

    console.log("User saved to DB with ownerId:", newUser.ownerId);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        hasFile: !!newUser.file,
        fileUrl: newUser.file?.url,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
};

// Login (unchanged)
export const login = async (req, res) => {
  try {
    console.log("Login hit with body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        hasFile: !!user.file,
        fileUrl: user.file?.url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
