import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let onlineUser = {};
const peerSocketMap = new Map();

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
    if (peerSocketMap.has(peerId)) {
      console.log(`Peer ID ${peerId} already registered`);
      return;
    }
    peerSocketMap.set(peerId, socket.id);
    console.log(`Peer ID ${peerId} registered with socket ID ${socket.id}`);
  });

  // Listen for call offer
  socket.on("callOffer", (data) => {
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
    console.log("User is Disconnected", socket.id);
    delete onlineUser[id];
    emitOnlineUsers();
    // Remove socket ID from peerSocketMap
    console.log("Peer Socket Map", peerSocketMap);
    for (let [peerId, socketId] of peerSocketMap.entries()) {
      if (socketId === socket.id) {
        console.log(`Peer ID ${peerId} disconnected`);
        peerSocketMap.delete(peerId);
        break;
      }
    }
  });

  socket.on("call_user", (data) => {
    const { id, offer } = data;
    console.log(onlineUser[id], "call_user", "100");
    io.to(onlineUser[id]).emit("request_call", { offer, id: socket.id });
  });
  socket.on("call_accept", (data) => {
    const { id, answer } = data;
    console.log("call_accept", id, "105");
    io.to(id).emit("call_accepted", answer);
  });

  socket.on("negotiatition", (data) => {
    const { id, offer } = data;
    console.log("negotiatition", id, "110");
    io.to(onlineUser[id]).emit("negotiatition_request", {offer,id:socket.id});
  });

  socket.on("negotiatition_accpet", (data) => {
    const { id, answer } = data;
    console.log("negotiatition_accpet", id, "115");
    io.to(id).emit("negotiatition_accepted", answer);
  });
});

export { app, io, server };
