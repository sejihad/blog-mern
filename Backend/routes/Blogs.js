import express from "express";
import { Create, DeleteBlog, GetPosts, update } from "../controllers/Blog.js";
import { isAdmin } from "../middleware/CheckAdmin.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/create", isAdmin, Create);
BlogRoutes.patch("/update/:id", isAdmin, update);
BlogRoutes.get("/GetPosts", GetPosts);
BlogRoutes.delete("/delete/:id", isAdmin, DeleteBlog);

export default BlogRoutes;
