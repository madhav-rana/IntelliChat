import rateLimit from "express-rate-limit";

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 10,                    // max 10 requests per minute
  message: { message: "Too many requests, slow down!" }
});