import Users from "../models/users.model.js";
import Message from "../models/message.model.js";
import { getUserSocketId, io } from "../lib/socket-io.js";
import { encryptData, generateUniqueId } from "../lib/crypto.js";
import Group from "../models/group.model.js";

export const sidebarUser = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    // Find the groups where the user is a member or an admin
    let groups = await Group.find({ members: loggedUserId }).populate(
      "members",
      "fullname profilePic _id messagePermission"
    );

    const userContacts = await Users.findById(loggedUserId).select("contacts");

    for (const group of groups) {
      for (const member of group.members) {
        const contact = userContacts.contacts.find(
          (contact) => contact.userId.toString() === member._id.toString()
        );
        const displayName = contact ? contact.savedName : member.fullname;
        member.fullname = displayName;
      }
    }

    const messages = await Message.find({
      $or: [{ sender: loggedUserId }, { receiver: loggedUserId }],
    });

    const groupsWithLastMessage = await Promise.all(
      groups.map(async (group) => {
        const lastMessage = await Message.findOne({
          receiver: group._id,
          members: { $in: loggedUserId },
          deletedByUsers: { $ne: loggedUserId },
        })
          .sort({ createdAt: -1 })
          .limit(1)
          .select("data type createdAt sender receiver");

        let unseen = await Message.find({
          receiver: group._id,
          sender: { $ne: loggedUserId },
          "read.user": { $ne: loggedUserId },
          members: { $in: loggedUserId },
        }).countDocuments();
        const {
          _id,
          name,
          photo,
          members,
          admins,
          admin,
          inviteLink,
          messagePermission,
        } = group;
        return {
          _id,
          fullname: name,
          profilePic: photo,
          members,
          admins,
          admin,
          unseen,
          inviteLink,
          messagePermission,
          sender: lastMessage?.sender,
          receiver: group._id,
          type: "Group",
          lastMessage:
            lastMessage?.type == "text"
              ? lastMessage.data
              : lastMessage?.type || null,
          lastMessageType: lastMessage?.type || null,
          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

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
          .limit(1)
          .select("data type createdAt sender receiver");

        let unseen = await Message.find({
          sender: user._id,
          receiver: loggedUserId,
          "read.user": { $ne: loggedUserId },
          deletedByUsers: { $ne: loggedUserId },
        }).countDocuments();

        return {
          _id: user._id,
          fullname: user.fullname,
          profilePic: user.profilePic,
          phone: user.phone,
          sender: lastMessage?.sender,
          receiver: lastMessage?.receiver,
          type: "Single",
          unseen,
          lastMessage: lastMessage
            ? lastMessage.type == "text"
              ? lastMessage.data
              : lastMessage.type
            : null,
          lastMessageType: lastMessage ? lastMessage.type : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    const merge = [...usersWithLastMessage, ...groupsWithLastMessage].sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.status(200).json({ success: true, usersWithLastMessage: merge });
  } catch (error) {
    console.log("error in sidebarUser controller: ", error.message);
    res.status(200).json({ message: "Server error" });
  }
};

export const contactList = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const loggedUser = await Users.findById(loggedUserId).select("contacts");

    if (!loggedUser) {
      return res.status(200).json({ message: "User not found" });
    }

    const contactsWithUserIds = loggedUser.contacts.map((contact) => ({
      userId: contact.userId,
      savedName: contact.savedName,
    }));

    const userIds = contactsWithUserIds.map((contact) => contact.userId);

    const connectedUsers = await Users.find({
      _id: { $in: userIds },
    }).select("phone email fullname profilePic about");

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
    res.status(200).json({ success: false, message: "Server error" });
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
    res.status(200).json({ success: false, message: "Server error" });
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
    res.status(200).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const myId = req.user._id;
  const { Datalength, type } = req.query;
  if (!myId)
    return res.status(200).json({ message: "Server error", success: 0 });

  const { id: userToChatId } = req.params;
  try {
    let find;
    if (type == "Group") {
      find = Message.find({
        receiver: userToChatId,
        deletedByUsers: { $ne: myId },
        members: { $in: myId },
      })
        .sort({ createdAt: -1 })
        .skip(Datalength)
        .limit(10);

      await Message.updateMany(
        {
          sender: { $ne: myId },
          receiver: userToChatId,
          deletedByUsers: { $ne: myId },
          members: { $in: myId },
          "read.user": { $ne: myId }, // Only update unread messages
        },
        { $push: { read: { user: myId, seenAt: new Date() } } }
      );
    } else {
      find = Message.find({
        $or: [
          { sender: myId, receiver: userToChatId },
          { sender: userToChatId, receiver: myId },
        ],
        deletedByUsers: { $ne: myId },
      })
        .sort({ createdAt: -1 })
        .skip(Datalength)
        .limit(10);

      await Message.updateMany(
        {
          sender: userToChatId,
          receiver: myId,
          deletedByUsers: { $ne: myId },
          "read.user": { $ne: myId }, // Only update unread messages
        },
        { $push: { read: { user: myId, seenAt: new Date() } } }
      );
    }

    io.to(getUserSocketId(userToChatId)).emit(
      "messagesRead",
      type,
      userToChatId,
      myId,
      false
    );
    const message = await find;

    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessage controller: ", error.message);
    res.status(200).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { data, type } = req.body.data;
  const myId = req.user._id;
  const ChatType = req.body.type;
  const { fullname, profilePic } = req.body.notification;
  const { id: receiver } = req.params;
  try {
    let secretkey = generateUniqueId(myId, receiver);
    let enrData = encryptData(data, secretkey);

    const newMessage = new Message({
      sender: myId,
      receiver,
      type,
      data: enrData,
    });
    await newMessage.save();

    if (ChatType == "Group") {
      const { members } = req.body;
      newMessage.members = [myId, ...members];
    }

    io.to(getUserSocketId(myId)).emit("newMessage", {
      newMessage,
      profilePic,
      name: fullname,
      ChatType,
    });

    if (ChatType == "Group") {
      const { members } = req.body;

      members.forEach((element) => {
        io.to(getUserSocketId(element._id)).emit("newMessage", {
          newMessage,
          profilePic,
          name: fullname,
          ChatType,
        });
      });
    } else {
      io.to(getUserSocketId(receiver)).emit("newMessage", {
        newMessage,
        profilePic,
        name: fullname,
        ChatType,
      });
    }
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller: ", error.message);
    res.status(200).json({ message: "Server error" });
  }
};

export const clearChat = async (req, res) => {
  const { id: receiverId } = req.params;
  const { type } = req.query;
  const myId = req.user._id;

  if (type == "Group") {
    await Message.updateMany(
      {
        receiver: receiverId,
      },
      {
        $addToSet: { deletedByUsers: myId }, // Add userId to the deletedByUsers array (if not already present)
      }
    );
  } else {
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
  }

  res.status(200).json({ success: 1 });
};
export const MessageReaction = async (req, res) => {
  const { id, userId, reaction, to, members, ChatType } = req.body;

  let message = await Message.findById(id);
  if (!message) return res.status(200).json({ error: "Message not found" });

  const reactionItem = message.reaction.find(
    (item) => item.user.toString() === userId.toString()
  );

  if (reactionItem) {
    reactionItem.id = reaction.id;
    reactionItem.label = reaction.label;
  } else {
    message.reaction.push({
      id: reaction.id,
      label: reaction.label,
      user: userId,
    });
  }

  await message.save();

  // Emit update to all users in the chat
  const userSockets = new Set();
  const receiverSocket = getUserSocketId(to);
  if (receiverSocket) userSockets.add(receiverSocket);

  members.forEach((member) => {
    const memberSocket = getUserSocketId(member._id);
    if (memberSocket) userSockets.add(memberSocket);
  });

  userSockets.forEach((socketId) => {
    io.to(socketId).emit("message_reaction", id, {
      id: reaction.id,
      label: reaction.label,
      user: userId,
      ChatType,
    });
  });

  res.status(200).json({ success: 1 });
};

export const handleVote = async (req, res) => {
  const { pollId, to, members, data } = req.body;
  await Message.findByIdAndUpdate(pollId, { data: data });
  members.forEach((element) => {
    const receiverId = getUserSocketId(element._id);
    if (receiverId) {
      io.to(receiverId).emit("vote", { data, pollId });
    }
  });

  if (!members.length) {
    const receiverId = getUserSocketId(to);
    if (receiverId) {
      io.to(receiverId).emit("vote", { data, pollId });
    }
  }
  res.status(200).json({ success: 1 });
};

export const DeleteMessage = async (req, res) => {
  const { messageId } = req.body;

  await Message.updateMany(
    { _id: { $in: messageId } },
    { $push: { deletedByUsers: req.user._id } }
  );

  res.status(200).json({ success: 1 });
};
