import express from "express";
import cors from "cors";
import userRouter from "./services/users.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import propertyRouter from "./services/property.js";
import bookingRoute from "./services/booking.js";
import { checkSuspended } from "./middlewares/suspension.js";
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(checkSuspended);
app.use(userRouter);
app.use(propertyRouter);
app.use(bookingRoute);
app.all(/^\/api\/auth/, toNodeHandler(auth));
app.get("/", async (req, res) => {
    res.send({
        success: true,
        message: "Server is running smoothly.................!"
    });
});
export default app;
