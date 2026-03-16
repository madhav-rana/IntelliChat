import Groq from "groq-sdk";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { generateTitle } from "../utils/generateTitle.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message, model = "llama3-8b-8192" } = req.body;

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      const title = generateTitle(message);
      conversation = await Conversation.create({
        userId: req.user.id,
        title,
        model
      });
    }

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      role: "user",
      content: message
    });

    // Fetch previous messages for context
    const history = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    const messages = history.map((m) => ({
      role: m.role,
      content: m.content
    }));

    // Stream response from Groq
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await groq.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens: 1024
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }

    // Save assistant message
    await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: fullResponse
    });

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();

  } catch (err) {
    next(err);
  }
};