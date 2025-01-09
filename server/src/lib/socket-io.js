import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ExpressPeerServer } from "peer";

const app = express();
const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// PeerJS setup
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/peerjs",
});

app.use("/peerjs", peerServer);

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

  // join room for voice call
  socket.on("join-room", (roomId, peerId) => {
    console.log(`User joined room: ${roomId}, PeerID: ${peerId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);
  });

  socket.on("disconnect", () => {
    console.log("User is Disconnected", socket.id);
    delete onlineUser[id];
    emitOnlineUsers();
  });
});

export { app, io, server };
