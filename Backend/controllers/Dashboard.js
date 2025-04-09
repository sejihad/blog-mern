import { v2 as cloudinary } from "cloudinary";
import Blgomodel from "../models/Blog.js";
import CommentModel from "../models/Commments.js";
import UserModal from "../models/User.js";
const Dashboard = async (req, res) => {
  try {
    const Users = await UserModal.find();
    const Posts = await Blgomodel.find();
    const comments = await CommentModel.find();

    if (!Users && !Posts && !comments) {
      return res
        .status(404)
        .json({ success: false, message: "Not Data Found" });
    }
    res.status(200).json({ success: true, Users, Posts, comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const GetUsers = async (req, res) => {
  try {
    const Users = await UserModal.find();
    if (!Users) {
      res.status(404).json({ success: false, message: "No Data Found" });
    }
    res.status(200).json({ success: true, Users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const Delete = async (req, res) => {
  try {
    const userId = req.params.id;

    const ExistUser = await UserModal.findById(userId);
    if (!ExistUser) {
      return res.status(404).json({ success: false, message: "No User Found" });
    }
    if (ExistUser.role == "admin") {
      return res.status(404).json({
        success: false,
        message: "Soory Your Admin You Can't Delete You Account",
      });
    }
    // Delete the user's profile image if it exists
    if (ExistUser.profile && ExistUser.profile?.public_id) {
      await cloudinary.uploader.destroy(ExistUser.profile?.public_id);
    }

    const DeleteUser = await UserModal.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "user Deleted Successfully",
      User: DeleteUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { Dashboard, Delete, GetUsers };
