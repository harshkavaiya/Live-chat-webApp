import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";
import {
  acceptCall,
  endCall,
  missedCall,
  rejectCall,
  startCall,
} from "../controllers/call.controller.js";
import Users from "../models/users.model.js";
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

const emitOnlineUsers = async () => {
  const onlineUsersList = [];

  for (const userId of Object.keys(onlineUser)) {
    try {
      const user = await Users.findById(userId);
      if (user) {
        onlineUsersList.push({
          id: userId,
          name: user.fullname,
          profilePhoto: user.profilePic,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

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
  socket.on("callOffer", async (data) => {
    if (!isValidObjectId(data.from) || !isValidObjectId(data.to)) {
      console.log("❌ Invalid callerId or receiverId.");
      return;
    }
    const call = await startCall(data.from, data.to, data.callType);
    if (!call) return;

    const receiverSocketId = getUserSocketId(data.to); // Find socket ID for 'to' Peer ID

    const callerUser = await Users.findById(data.from).select(
      "fullname profilePic"
    );

    if (callerUser) {
      // if contacts custom use saved name
      const receiverUser = await Users.findById(data.to).select("contacts");
      receiverUser.contacts.forEach((contact) => {
        if (contact.userId == data.from) {
          callerUser.fullname = contact.savedName;
        }
      });

      // Correct data send to receiver
      const userdata = {
        fullname: callerUser.fullname,
        photo: callerUser.profilePic,
      };

      // if (receiverSocketId) {
      //   const user = await Users.findById(data.to).select(
      //     "fullname profilePic contacts"
      //   );
      //   if (user) {
      //     user.contacts = user.contacts.map((contact) => {
      //       if (contact.userId == data.from) {
      //         user.fullname = contact.savedName;
      //       }
      //     });
      //   }
      //   const userdata = { fullname: user.fullname, photo: user.profilePic };
      io.to(receiverSocketId).emit("callOffer", {
        from: data.from,
        callType: data.callType,
        userdata,
      });
      console.log(
        `Call offer sent from ${data.from} to ${data.to} - ${socket.id}`
      );
    } else {
      console.log(`Peer ID ${data.to} not found`);
    }
  });

  // Listen for accept call
  socket.on("acceptCall", async (data) => {
    await acceptCall(data.to, data.from);
    const callerSocketId = getUserSocketId(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { from: data.from });
      console.log(`Call accepted by ${data.from}`);
    }
  });

  // Listen for call rejection
  socket.on("callRejected", async (data) => {
    await rejectCall(data.from, data.to);
    const callerSocketId = getUserSocketId(data.to); // Find socket ID for 'to' Peer ID
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", { from: data.to }); // Notify caller that the call was rejected
      console.log(`Call rejected by ${data.to}`);
    } else {
      console.log(`Caller ${data.to} not found`);
    }
  });

  // Listen for end call
  socket.on("endCall", async (data) => {
    await endCall(data.to, data.from);
    console.log(`Call ended by ${data.from}`);
    // const receiverSocketId = getUserSocketId(data.from);
    const callerSocketId = getUserSocketId(data.to);

    console.log("callersocket", callerSocketId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callEnded", { from: data.from });
      console.log(`Call ended notification sent to caller id: ${data.to}`);
    }
  });

  //Missed Call
  socket.on("missedCall", async (data) => {
    await missedCall(data.from, data.to);
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

  socket.on("messagesRead", async (type, sender, myId, userToChatId) => {
    if (userToChatId) {
      if (type == "Group") {
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
        io.to(getUserSocketId(sender)).emit("messagesRead", myId, userToChatId);
      } else {
        await Message.updateMany(
          {
            sender: sender,
            receiver: myId,
            "read.user": { $ne: myId },
            deletedByUsers: { $ne: myId },
          },
          { $push: { read: { user: myId, seenAt: new Date() } } }
        );
        io.to(getUserSocketId(sender)).emit("messagesRead", myId, myId);
      }
    }
  });
});

export { app, io, server };
