import Users from "../models/users.model.js";
import Message from "../models/message.model.js";
import { getUserSocketId, io } from "../lib/socket-io.js";

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

    const connectedUsers = await Users.find({
      _id: { $in: loggedUser.contacts },
    }).select("-password");

    res.status(200).json(connectedUsers);
  } catch (error) {
    console.log("error in contactList controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const addNewContact = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const contactUser = await Users.findOne({ phone }).select("-password");

    if (!contactUser) {
      return res
        .status(404)
        .json({ message: "User with this phone number not found" });
    }

    if (contactUser._id.toString() === loggedUserId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a contact" });
    }

    const loggedUser = await Users.findById(loggedUserId);

    if (loggedUser.contacts.includes(contactUser._id)) {
      return res
        .status(400)
        .json({ message: "User is already in your contacts" });
    }

    loggedUser.contacts.push(contactUser._id);
    await loggedUser.save();

    // Optional
    //   if (!contactUser.contacts.includes(loggedUserId)) {
    //     contactUser.contacts.push(loggedUserId);
    //     await contactUser.save();
    //   }

    res
      .status(200)
      .json({ message: "Contact added successfully", contact: contactUser });
  } catch {
    console.log("error in newAddContact controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const myId = req.user._id;

  if (!myId)
    return res.status(400).json({ message: "Server error", success: 0 });
  const { id: userToChatId } = req.params;
  try {
    const message = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessage controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { data, type } = req.body;
  const myId = req.user._id;
  const { id: receiver } = req.params;
  try {
    // let imageUrl;
    // if (image) {
    //   const uploadCloudinary = await Cloudinary.uploader.upload(image);
    //   imageUrl = uploadCloudinary.secure_url;
    // }

    const newMessage = new Message({
      sender: myId,
      receiver,
      type,
      data,
    });
    await newMessage.save();
    let receiverSoket = getUserSocketId(receiver);

    if (receiverSoket) {
      io.to(receiverSoket).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//socket.io
