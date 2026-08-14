import express from "express";
import cors from "cors";
import userRouter from "./services/users.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import propertyRouter from "./services/property.js";
import bookingRoute from "./services/booking.js";
import { checkSuspended } from "./middlewares/suspension.js";

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://luxe-space-prisma-postgres-sql-client-d8n2o9gns.vercel.app"
];

if (process.env.FRONTEND_URL) {
  // Trailing slash থাকলে তা সরিয়ে যোগ করবে
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Production-এ strict করতে চাইলে: callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.all(/^\/api\/auth/, toNodeHandler(auth));

app.use(checkSuspended);

app.use(userRouter);
app.use(propertyRouter);
app.use(bookingRoute);

app.get("/", async (req, res) => {
  res.send({
    success: true,
    message: "Server is running smoothly.................!",
  });
});

export default app;