import express from "express";
import { Login, Logout, Register, updateProfile } from "../controllers/Auth.js";
import { isLogin } from "../middleware/CheckAdmin.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", Register);
AuthRoutes.post("/login", Login);
AuthRoutes.patch("/profile/:id", isLogin, updateProfile);
AuthRoutes.post("/logout", Logout);

export default AuthRoutes;
