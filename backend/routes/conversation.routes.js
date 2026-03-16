import express from "express";
import {
  getConversations,
  getConversationMessages,
  deleteConversation,
  renameConversation
} from "../controllers/conversation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getConversationMessages);
router.delete("/:id", protect, deleteConversation);
router.patch("/:id/rename", protect, renameConversation);

export default router;