import { Server } from "socket.io";
import http from "http";
import express from "express";
import { allowedOrigins } from "../utils/allowedOrigins.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://aman-chat-app.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; //{userId : socketId}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("userId", userId);

  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to emit an event to all connected clients.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen for events emitted by the client-side code.
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
