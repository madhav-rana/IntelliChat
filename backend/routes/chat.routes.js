import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { chatLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/", protect, chatLimiter, sendMessage);

export default router;