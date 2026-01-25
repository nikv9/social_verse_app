import { Server } from "socket.io";
import Message from "../models/msg_model.js";
import Chat from "../models/chat_model.js";

export const initSocket = (server) => {
  // const io = new Server(server, {
  //   cors: {
  //     origin: "*",
  //     methods: ["GET", "POST", "PUT"],
  //   },
  // });
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.frontend_base_url,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // join user room
    socket.on("joinUser", (userId) => {
      socket.join(`user_${userId}`);
    });

    // Join a chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    // Handle sending message
    socket.on("sendMsg", async (data) => {
      const { roomId, message } = data;

      const fullMsg = await Message.findById(message.payload._id).populate(
        "sender",
        "name email"
      );

      // chat room message
      io.to(roomId).emit("receiveMsg", fullMsg);

      // 🔥 chat list update
      const chat = await Chat.findById(roomId).populate(
        "participants",
        "_id name email profileImg"
      );

      chat.participants.forEach((user) => {
        io.to(`user_${user._id}`).emit("chatUpdated", chat);
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
