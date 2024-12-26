import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = {};

export const getUserSocketId = (data) => {
  console.log(onlineUser[data])
  return onlineUser[data];
};

io.on("connection", (socket) => {
  console.log("new Connection", socket.id);

  const id = socket.handshake.query.userId;
 
  onlineUser[id] = socket.id;
 
  socket.on("disconnected", () => {
    console.log("User is Disconnected", socket.id);
    delete onlineUser[id];
  });
});

export { app, io, server };
