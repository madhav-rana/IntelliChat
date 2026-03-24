// import Groq from "groq-sdk";
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { generateTitle } from "../utils/generateTitle.js";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export const sendMessage = async (req, res, next) => {
//   try {
//     // const { conversationId, message, model = "llama-3.1-70b-versatile" } = req.body;
//     const { conversationId, message, model = "openai/gpt-oss-20b" } = req.body;

//     // Get or create conversation
//     let conversation;
//     if (conversationId) {
//       conversation = await Conversation.findById(conversationId);
//     } else {
//       const title = generateTitle(message);
//       conversation = await Conversation.create({
//         userId: req.user.id,
//         title,
//         model
//       });
//     }

//     // Save user message
//     await Message.create({
//       conversationId: conversation._id,
//       role: "user",
//       content: message
//     });

//     // Fetch previous messages for context
//     const history = await Message.find({
//       conversationId: conversation._id
//     }).sort({ createdAt: 1 });

//     const messages = history.map((m) => ({
//       role: m.role,
//       content: m.content
//     }));

//     // Stream response from Groq
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");
//     const stream = await groq.chat.completions.create({
//       model,
//       messages,
//       stream: true,
//       max_tokens: 1024
//     });
//     let fullResponse = "";

//     for await (const chunk of stream) {
//       const content = chunk.choices[0]?.delta?.content || "";
//       fullResponse += content;
//       res.write(`data: ${JSON.stringify({ content })}\n\n`);
//     }

//     // Save assistant message
//     await Message.create({
//       conversationId: conversation._id,
//       role: "assistant",
//       content: fullResponse
//     });

//     res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
//     res.end();

//   } catch (err) {
//     next(err);
//   }
// };









import Groq from "groq-sdk";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { generateTitle } from "../utils/generateTitle.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Token estimation (rough)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

export const sendMessage = async (req, res, next) => {
  try {
    const {
      conversationId,
      message,
      model = "openai/gpt-oss-20b"
      // model = "llama-3.1-8b-instant"
    } = req.body;

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

    // Fetch history
    const history = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    // Smart trim history (token-based)
    let totalTokens = 0;
    const MAX_INPUT_TOKENS = 6000;

    const trimmedHistory = [];

    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const tokens = estimateTokens(msg.content);

      if (totalTokens + tokens > MAX_INPUT_TOKENS) break;

      trimmedHistory.unshift(msg);
      totalTokens += tokens;
    }

    // System prompt (for beautiful formatting)
    const systemPrompt = {
      role: "system",
      content: `
You are a helpful AI assistant.

Follow these rules strictly:
- Use clear headings
- Use bullet points when needed
- Keep paragraphs short
- Format responses in markdown
- Avoid long walls of text
- Be clean and readable
`
    };

    const messages = [
      systemPrompt,
      ...trimmedHistory.map((m) => ({
        role: m.role,
        content: m.content
      }))
    ];

    // Dynamic max_tokens
    const MODEL_LIMIT = 8192;
    const SAFE_BUFFER = 500;

    const max_tokens = Math.max(
      256,
      MODEL_LIMIT - totalTokens - SAFE_BUFFER
    );

    // 🌊 Setup SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Start streaming
    const stream = await groq.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens
    });

    let fullResponse = "";

    // Stream chunks
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (!content) continue;

      fullResponse += content;

      res.write(
        `data: ${JSON.stringify({
          content,
          done: false
        })}\n\n`
      );
    }

    // Save assistant response
    await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: fullResponse
    });

    // End stream
    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId: conversation._id
      })}\n\n`
    );

    res.end();
  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err.message);
    next(err);
  }
};