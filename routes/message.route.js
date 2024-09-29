import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { ProtectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/send-message/:id", sendMessage);
router.get("/get-message/:id", getMessages);

export default router;
