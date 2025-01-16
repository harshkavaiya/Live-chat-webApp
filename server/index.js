const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const peerSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Register Peer ID with socket ID
  socket.on("registerPeerId", (peerId) => {
    peerSocketMap.set(peerId, socket.id);
    console.log(`Peer ID ${peerId} registered with socket ID ${socket.id}`);
  });

  // Listen for call offer
  socket.on("callOffer", (data) => {
    console.log(`Call offer from ${data.from} to ${data.to}`);
    const receiverSocketId = peerSocketMap.get(data.to); // Find socket ID for 'to' Peer ID
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callOffer", { from: data.from });
      console.log(`Call offer sent from ${data.from} to ${data.to}`);
    } else {
      console.log(`Peer ID ${data.to} not found`);
    }
  });

  // Listen for accept call
  socket.on("acceptCall", (data) => {
    const callerSocketId = peerSocketMap.get(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { from: data.from });
      console.log(`Call accepted by ${data.from}`);
    }
  });

  // Listen for end call
  socket.on("endCall", (data) => {
    console.log(`Call ended by ${data.from}`);
    // const receiverSocketId = peerSocketMap.get(data.from);
    const callerSocketId = peerSocketMap.get(data.to);

    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("callEnded", { from: data.from });
    //   console.log(`Call ended notification sent to receiver Id: ${data.from}`);
    // }

    // Notify the user who ended the call (to clean up UI)
    if (callerSocketId) {
      io.to(callerSocketId).emit("callEnded", { from: data.from });
      console.log(`Call ended notification sent to caller id: ${data.to}`);
    }
  });

  socket.on("disconnect", () => {
    // Remove socket ID from peerSocketMap
    for (let [peerId, socketId] of peerSocketMap.entries()) {
      if (socketId === socket.id) {
        peerSocketMap.delete(peerId);
        console.log(`Peer ID ${peerId} disconnected`);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
