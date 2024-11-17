import { Server } from "socket.io";
import { Employee } from "./models/User.js";
import mongoose from "mongoose";

const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://vedic-crm.netlify.app",
        "https://vedic-employee.netlify.app",
        "https://crm-vedic-manager.netlify.app",
        "https://vedic-form.netlify.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const updateUserStatusInDB = async (userId, isOnline) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error(`Invalid userId: ${userId}`);
      return;
  }
    try {
      await Employee.findByIdAndUpdate(userId, { isOnline }, { new: true });
      console.log(`User ${userId} is now ${isOnline ? "online" : "offline"}`);
    } catch (error) {
      console.error(`Failed to update status for user ${userId}:`, error);
    }
  };

  const emitOnlineList = () => {
    const userOnline = Array.from(userSocketMap.keys());
    io.emit("online-list", userOnline);
  };

  const handleDisconnect = async (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    let disconnectedUser = null;

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        userSocketMap.delete(userId);
        break;
      }
    }

    if (disconnectedUser) {
      await updateUserStatusInDB(disconnectedUser, false);

      io.emit("user-status", {
        userId: disconnectedUser,
        isOnline: false,
      });
    }

    emitOnlineList();
  };

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);

      await updateUserStatusInDB(userId, true);

      io.emit("user-status", {
        userId,
        isOnline: true,
      });

      emitOnlineList();
    } else {
      console.log("User ID not provided in handshake query");
    }

    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setUpSocket;
