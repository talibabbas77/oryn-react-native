import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import { clerkMiddleware } from '@clerk/express'
import authRoutes from "./routes/authRoute.js";
import chatRoutes from "./routes/userRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(clerkMiddleware());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;