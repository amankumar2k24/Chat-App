import express from "express";
import { getSidebarUser } from "../controllers/user.controller.js";
import { ProtectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/get-users", getSidebarUser);

export default router;
