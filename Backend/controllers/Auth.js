import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import UserModal from "../models/User.js";

// Register Function
const Register = async (req, res) => {
  try {
    const { FullName, email, password, profile } = req.body;

    if (!FullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email, and Password are required.",
      });
    }

    // Check if profile image is provided
    if (!profile || typeof profile !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required" });
    }

    let profileData = { public_id: "", url: "" }; // Default Profile

    if (profile) {
      const myCloud = await cloudinary.uploader.upload(profile, {
        folder: "user_profiles",
        width: 150,
        crop: "scale",
      });

      profileData = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const existUser = await UserModal.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists. Please Login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModal({
      FullName,
      email,
      password: hashedPassword,
      profile: profileData,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ success: false, message: "Error during registration" });
  }
};

// Login Function
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const FindUser = await UserModal.findOne({ email });
    if (!FindUser) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register.",
      });
    }

    const comparePassword = await bcrypt.compare(password, FindUser.password);
    if (!comparePassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: FindUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user: FindUser,
      token,
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout Function
const Logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    // Return success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // Handle error
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Update Profile Function

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { FullName, oldpassword, newpassword, profile } = req.body;

    const ExistUser = await UserModal.findById(userId);
    if (!ExistUser) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    }

    // Password change handling
    if (oldpassword && newpassword) {
      const comparePassword = await bcrypt.compare(
        oldpassword,
        ExistUser.password
      );
      if (!comparePassword) {
        return res
          .status(401)
          .json({ success: false, message: "Old password is incorrect." });
      }
      ExistUser.password = await bcrypt.hash(newpassword, 10);
    }

    // Update Full Name if provided
    if (FullName) {
      ExistUser.FullName = FullName;
    }

    // Handle Profile Image Upload if provided
    if (profile && profile.url) {
      try {
        // Delete old profile image if exists
        if (ExistUser.profile?.public_id) {
          try {
            await cloudinary.uploader.destroy(ExistUser.profile.public_id);
          } catch (cloudinaryError) {
            console.warn(
              "Could not delete old image from Cloudinary:",
              cloudinaryError.message
            );
            // Continue with upload even if deletion fails
          }
        }

        // Upload new profile image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profile.url, {
          folder: "user_profiles",
          width: 150,
          crop: "scale",
        });

        ExistUser.profile = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
        };
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Profile image upload failed. Please try again.",
        });
      }
    }

    // Save updated user data
    await ExistUser.save();

    // Remove sensitive data before sending response
    const userResponse = ExistUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { Login, Logout, Register, updateProfile };
