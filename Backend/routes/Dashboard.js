import express from "express";
import { Dashboard, Delete, GetUsers } from "../controllers/Dashboard.js";
import { isAdmin } from "../middleware/CheckAdmin.js";

const DashboardRoutes = express.Router();

DashboardRoutes.get("/", isAdmin, Dashboard);
DashboardRoutes.get("/users", isAdmin, GetUsers);
DashboardRoutes.delete("/delete/:id", isAdmin, Delete);

export default DashboardRoutes;
