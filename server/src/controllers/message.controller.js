import Users from "../models/users.model.js";
import Message from "../models/message.model.js";
import { getUserSocketId, io } from "../lib/socket-io.js";
import mongoose from "mongoose";

export const sidebarUser = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: loggedUserId }, { receiver: loggedUserId }],
    });

    const userIds = [
      ...new Set(
        messages.map((msg) =>
          msg.sender.toString() === loggedUserId.toString()
            ? msg.receiver.toString()
            : msg.sender.toString()
        )
      ),
    ];

    const connectedUsers = await Users.find({ _id: { $in: userIds } }).select(
      "fullname _id profilePic phone"
    );

    const usersWithLastMessage = await Promise.all(
      connectedUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: loggedUserId, receiver: user._id },
            { sender: user._id, receiver: loggedUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("data type createdAt");

        let lastMessageData;
        // Some type data have return array and object so to change into text message
        if (lastMessage?.type == "text") {
          lastMessageData = lastMessage.data;
        } else {
          lastMessageData = lastMessage?.type;
        }

        return {
          _id: user._id,
          fullname: user.fullname,
          profilePic: user.profilePic,
          phone: user.phone,
          lastMessage: lastMessageData,
          lastMessageType: lastMessage ? lastMessage.type : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    res.status(200).json({ success: true, usersWithLastMessage });
  } catch (error) {
    console.log("error in sidebarUser controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const contactList = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const loggedUser = await Users.findById(loggedUserId).select("contacts");

    if (!loggedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const contactsWithUserIds = loggedUser.contacts.map((contact) => ({
      userId: contact.userId,
      savedName: contact.savedName,
    }));

    const userIds = contactsWithUserIds.map((contact) => contact.userId);

    const connectedUsers = await Users.find({
      _id: { $in: userIds },
    }).select("phone email fullname profilePic");

    const usersWithSavedNames = connectedUsers.map((user) => {
      const contact = contactsWithUserIds.find(
        (contact) => contact.userId.toString() === user._id.toString()
      );
      return {
        ...user._doc,
        savedName: contact ? contact.savedName : "", // Adding savedName
      };
    });

    res.status(200).json(usersWithSavedNames);
  } catch (error) {
    console.log("Error in contactList controller: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addNewContact = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const { phone, savedName } = req.body;

    if (!phone || !savedName) {
      return res.status(200).json({
        success: false,
        message: "Phone number and saved name are required",
      });
    }

    const contactUser = await Users.findOne({ phone }).select("-password");

    if (!contactUser) {
      return res.status(200).json({
        success: false,
        message: "User with this phone number not found",
      });
    }

    if (contactUser._id.toString() === loggedUserId.toString()) {
      return res.status(200).json({
        success: false,
        message: "You cannot add yourself as a contact",
      });
    }

    const loggedUser = await Users.findById(loggedUserId);

    if (!loggedUser.contacts) {
      loggedUser.contacts = [];
    }

    const isAlreadyAdded = loggedUser.contacts.some(
      (contact) =>
        contact.userId &&
        contact.userId.toString() === contactUser._id.toString()
    );

    if (isAlreadyAdded) {
      return res.status(200).json({
        success: false,
        message: "User is already in your contacts",
      });
    }

    loggedUser.contacts.push({
      userId: contactUser._id,
      savedName: savedName,
    });
    await loggedUser.save();

    res.status(200).json({
      success: true,
      message: "Contact added successfully",
      contact: {
        userId: contactUser._id,
        savedName: savedName,
        phone: contactUser.phone,
      },
    });
  } catch (error) {
    console.log("Error in newAddContact controller: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const { contactId } = req.body;

    if (!contactId) {
      return res
        .status(200)
        .json({ success: false, message: "Contact ID is required" });
    }

    const loggedUser = await Users.findById(loggedUserId);

    if (!loggedUser) {
      return res
        .status(202)
        .json({ success: false, message: "User not found" });
    }

    // Check if contact exists in the list
    const contactIndex = loggedUser.contacts.findIndex(
      (contact) => contact.userId.toString() === contactId
    );

    if (contactIndex === -1) {
      return res
        .status(202)
        .json({ success: false, message: "Contact not found in your list" });
    }

    // Remove contact from the array
    loggedUser.contacts.splice(contactIndex, 1);
    await loggedUser.save();

    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.log("Error in deleteContact controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const myId = req.user._id;
  const { Datalength } = req.query;

  if (!myId)
    return res.status(400).json({ message: "Server error", success: 0 });
  const { id: userToChatId } = req.params;
  try {
    let find = Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
      deletedByUsers: { $ne: myId },
    })
      .sort({ createdAt: -1 })
      .skip(Datalength)
      .limit(10)
      .sort({ createdAt: 1 });

    const message = await find;
    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessage controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { data, type } = req.body.data;
  const myId = req.user._id;
  const { fullname, profilePic } = req.body.receiver;
  const { id: receiver } = req.params;
  try {
    const newMessage = new Message({
      sender: myId,
      receiver,
      type,
      data,
    });
    await newMessage.save();
    let receiverSoket = getUserSocketId(receiver);

    if (receiverSoket) {
      io.to(receiverSoket).emit("newMessage", {
        newMessage,
        profilePic: profilePic,
        name: fullname,
      });
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearChat = async (req, res) => {
  const { id: receiverId } = req.params;
  const myId = req.user._id;

  await Message.updateMany(
    {
      $or: [
        { sender: myId, receiver: receiverId },
        { sender: receiverId, receiver: myId },
      ],
    },
    {
      $addToSet: { deletedByUsers: myId }, // Add userId to the deletedByUsers array (if not already present)
    }
  );

  res.status(200).json({ success: 1 });
};
export const MessageReaction = async (req, res) => {
  const { reaction, id, to } = req.body;

  await Message.findByIdAndUpdate(id, { reaction: reaction });
  let receiverSoket = getUserSocketId(to);

  io.to(receiverSoket).emit("message_reaction", { id, reaction });

  res.status(200).json({ success: 1 });
};

//socket.io
