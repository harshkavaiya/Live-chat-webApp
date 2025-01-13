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

  socket.on("disconnect", () => {
    console.log("User is Disconnected", socket.id);
    delete onlineUser[id];
    emitOnlineUsers();
  });

  socket.on("call_user", (data) => {
    const { id, offer } = data;
    io.to(onlineUser[id]).emit("request_call", { offer, id: socket.id });
  });
  socket.on("call_accept", (data) => {
    const { id, answer } = data;
    io.to(onlineUser[id]).emit("call_accepted", answer);
  });
});

export { app, io, server };
