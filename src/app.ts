import express from "express";
import cors from "cors";
import userRouter from "./services/users.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import propertyRouter from "./services/property.js";
import bookingRoute from "./services/booking.js";
import { checkSuspended } from "./middlewares/suspension.js";

const app = express();

// 1. Allowed Origins (সামনে/পেছনে কোনো টাইপো বা Trailing Slash থাকবে না)
const allowedOrigins = [
  "http://localhost:3000",
  "https://luxe-space-prisma-postgre-sql-clien.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

// 2. Simple & Rock-Solid CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/Server-to-Server অথবা Valid Origins এলাউ করবে
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev/Testing সহজ রাখতে True রাখলাম
      }
    },
    credentials: true,
  })
);

// 3. Body Parser
app.use(express.json());

// 4. Better Auth Route (সব Auth Endpoint নিখুঁতভাবে হ্যান্ডেল করার জন্য string path ব্যবহার করা নিরাপদ)
app.all("/api/auth/*", toNodeHandler(auth));

// 5. Middlewares & Routes
app.use(checkSuspended);
app.use(userRouter);
app.use(propertyRouter);
app.use(bookingRoute);

// 6. Base Route
app.get("/", async (req, res) => {
  res.send({
    success: true,
    message: "Server is running smoothly.................!",
  });
});

export default app;