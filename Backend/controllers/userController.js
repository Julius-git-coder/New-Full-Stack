import UserModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch user",
      details: error.message,
    });
  }
};

// Create new user with file upload
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const newUser = {
      name,
      email,
      phone,
      address,
    };

    // If file is uploaded, upload to Cloudinary
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
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          uploadStream.end(req.file.buffer);
        });

        newUser.file = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          filename: req.file.originalname,
        };

        console.log("File uploaded to Cloudinary:", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(400).json({
          error: "Failed to upload file to Cloudinary",
          details: uploadError.message,
        });
      }
    }

    const user = await UserModel.create(newUser);

    res.status(201).json({
      message: "User created successfully",
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
    console.error("Error creating user:", error);
    res.status(400).json({
      error: "Failed to create user",
      details: error.message,
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update basic fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // If new file is uploaded
    if (req.file) {
      // Delete old file from Cloudinary if exists
      if (user.file && user.file.publicId) {
        try {
          await cloudinary.uploader.destroy(user.file.publicId);
          console.log("Old file deleted from Cloudinary");
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      // Upload new file
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

        user.file = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          filename: req.file.originalname,
        };
      } catch (uploadError) {
        return res.status(400).json({
          error: "Failed to upload new file",
          details: uploadError.message,
        });
      }
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update user",
      details: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete file from Cloudinary if exists
    if (user.file && user.file.publicId) {
      try {
        await cloudinary.uploader.destroy(user.file.publicId);
        console.log("File deleted from Cloudinary:", user.file.publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    await UserModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User and associated file deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete user",
      details: error.message,
    });
  }
};

// Download/view user's file
export const downloadFile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.file || !user.file.url) {
      return res.status(404).json({
        error: "No file found for this user",
      });
    }

    // Redirect to Cloudinary URL
    res.redirect(user.file.url);
  } catch (error) {
    res.status(500).json({
      error: "Failed to download file",
      details: error.message,
    });
  }
};
