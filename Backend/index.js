import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import DBCon from "./libs/db.js";
import AuthRoutes from "./routes/Auth.js";
import BlogRoutes from "./routes/Blogs.js";
import CommentRoutes from "./routes/Comments.js";
import DashboardRoutes from "./routes/Dashboard.js";
import PublicRoutes from "./routes/Public.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
DBCon();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (req, res) => {
  res.send("hello from server");
});
app.use(express.static("public"));
app.use(cookieParser());
const corsOptoins = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors(corsOptoins));
app.use("/auth", AuthRoutes);
app.use("/blog", BlogRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/comment", CommentRoutes);
app.use("/public", PublicRoutes);

app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});
