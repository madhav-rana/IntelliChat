// models/Conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  model: {
    type: String,
    default: "llama3-8b-8192"
  }
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);