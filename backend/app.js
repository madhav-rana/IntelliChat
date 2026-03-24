import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDb } from "./utils/connectToDb.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";


const app = express();
const port = process.env.PORT || 3000;

// Middlewares
// app.use(cors());
// app.use(cors({
//   origin: "https://intellichat-4.onrender.com", // or your frontend URL
//   credentials: true
// }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://intellichat-4.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Home route
app.get("/", (req, res) => res.json({ message: "App is running..." }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);



// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

// Start server
const startServer = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();