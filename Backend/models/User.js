import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Ensure all emails are stored in lowercase
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/demo/image/upload/v1682179425/default_profile.jpg", // Default profile image
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      lowercase: true,
    },
  },
  { timestamps: true }
);

const UserModal = mongoose.model("User", UserSchema);

export default UserModal;
