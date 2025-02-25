import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.VITE_CLIENT_HOST,
    credentials: true,
  },
});

let onlineUser = {};

export const getUserSocketId = (data) => {
  return onlineUser[data];
};

const emitOnlineUsers = () => {
  console.log("Online Users", onlineUser);
  const onlineUsersList = Object.keys(onlineUser);
  io.emit("onlineUsers", onlineUsersList);
};

io.on("connection", (socket) => {
  console.log("new Connection", socket.id);
  const id = socket.handshake.query.userId;
  onlineUser[id] = socket.id;
  emitOnlineUsers();

  // Register Peer ID with socket ID
  socket.on("registerPeerId", (peerId) => {
    if (getUserSocketId(peerId)) {
      console.log(`Peer ID ${peerId} already registered`);
      return;
    }
  });

  // Listen for call offer
  socket.on("callOffer", (data) => {
    const receiverSocketId = getUserSocketId(data.to); // Find socket ID for 'to' Peer ID
    console.log(receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callOffer", {
        from: data.from,
        callType: data.callType,
      });
      console.log(
        `Call offer sent from ${data.from} to ${data.to} - ${socket.id}`
      );
    } else {
      console.log(`Peer ID ${data.to} not found`);
    }
  });

  // Listen for accept call
  socket.on("acceptCall", (data) => {
    const callerSocketId = getUserSocketId(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { from: data.from });
      console.log(`Call accepted by ${data.from}`);
    }
  });

  // Listen for call rejection
  socket.on("callRejected", (data) => {
    const callerSocketId = getUserSocketId(data.to); // Find socket ID for 'to' Peer ID
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", { from: data.to }); // Notify caller that the call was rejected
      console.log(`Call rejected by ${data.to}`);
    } else {
      console.log(`Caller ${data.to} not found`);
    }
  });

  // Listen for end call
  socket.on("endCall", (data) => {
    console.log(`Call ended by ${data.from}`);
    // const receiverSocketId = getUserSocketId(data.from);
    const callerSocketId = getUserSocketId(data.to);

    console.log(callerSocketId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callEnded", { from: data.from });
      console.log(`Call ended notification sent to caller id: ${data.to}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User is Disconnected", socket.id);
    delete onlineUser[id];
    emitOnlineUsers();
  });

  socket.on("vote", async (data) => {
    const { pollId, to, optionIndex, from } = data;

    await Message.findByIdAndUpdate(pollId, {
      $inc: { [`data.options.${optionIndex}.vote`]: 1 },
      $push: { "data.voted": { id: from, ans: optionIndex } },
    });
    console.log(getUserSocketId(to));
    io.to(getUserSocketId(to)).emit("vote", { pollId, optionIndex, from });
  });

  socket.on("messagesRead", async (data, myId, userToChatId) => {
    if (userToChatId) {
      await Message.updateMany(
        {
          sender: { $ne: myId },
          receiver: userToChatId,
          "read.user": { $ne: myId },
          deletedByUsers: { $ne: myId },
          members: { $in: myId }, // Only update unread messages
        },
        { $push: { read: { user: myId, seenAt: new Date() } } }
      );
    }
    io.to(getUserSocketId(data)).emit("messagesRead", myId);
  });
});

export { app, io, server };
