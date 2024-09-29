import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { connectToMongoDB } from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import { allowedOrigins } from "./utils/allowedOrigins.js";

dotenv.config();

const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://aman-chat-app.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/user", userRoutes);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on PORT ${PORT}`);
});
