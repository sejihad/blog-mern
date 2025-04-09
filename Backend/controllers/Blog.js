import Blgomodel from "../models/Blog.js";

import { v2 as cloudinary } from "cloudinary";

const Create = async (req, res) => {
  try {
    const { title, desc, image } = req.body;

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload Base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "blog_posts",
      quality: "auto:good",
      transformation: [{ width: 800, crop: "scale" }],
    });

    // Create new blog post with Cloudinary URL
    const newBlog = new Blgomodel({
      title,
      desc,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog: {
        _id: newBlog._id,
        title: newBlog.title,
        desc: newBlog.desc,
        image: newBlog.image.url,
      },
    });
  } catch (error) {
    console.error("Error creating blog post:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const update = async (req, res) => {
  try {
    const { title, desc, image } = req.body;
    const blogId = req.params.id;

    const blogToUpdate = await Blgomodel.findById(blogId);
    if (!blogToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (image) {
      // Delete the old image from Cloudinary
      if (blogToUpdate.image?.public_id) {
        await cloudinary.uploader.destroy(blogToUpdate.image.public_id);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "blog_posts",
        quality: "auto:good",
        transformation: [{ width: 800, crop: "scale" }],
      });

      // Update the image field with new Cloudinary image details
      blogToUpdate.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    if (title) blogToUpdate.title = title;
    if (desc) blogToUpdate.desc = desc;

    await blogToUpdate.save();
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: blogToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const GetPosts = async (req, res) => {
  try {
    const posts = await Blgomodel.find();

    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const DeleteBlog = async (req, res) => {
  try {
    const postid = req.params.id;
    const posts = await Blgomodel.findById(postid);

    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (posts.image?.public_id) {
      await cloudinary.uploader.destroy(posts.image.public_id);
    }
    const deletepost = await Blgomodel.findByIdAndDelete(postid);
    res.status(200).json({
      success: true,
      message: "Post Delete Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { Create, DeleteBlog, GetPosts, update };
