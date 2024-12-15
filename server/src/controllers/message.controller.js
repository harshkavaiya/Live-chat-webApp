import Users from "../models/users.model.js";
import Message from "../models/message.model.js";

export const sidebarUser = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedUserId }, { receiverId: loggedUserId }],
    }).distinct("receiverId");

    const connectedUsers = await Users.find({
      _id: { $in: messages },
    }).select("-password");

    res.status(200).json(connectedUsers);
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
