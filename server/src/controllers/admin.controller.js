import Admin from "../models/admin.model.js";
import Users from "../models/users.model.js";
import Group from "../models/group.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserSocketId, io } from "../lib/socket-io.js";
import Message from "../models/message.model.js";

export const Register = async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingAdmin = await Admin.find({ username });
  if (existingAdmin.length) {
    return res.status(200).json({ message: "Admin already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({ username, password: hashedPassword });

  res.status(201).json({ message: "Admin registered successfully" });
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  // Find admin in "database"
  const admin = await Admin.find({ username });
  if (!admin.length) {
    return res.status(200).json({ message: "Invalid credentials", success: 0 });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin[0].password);
  if (!isMatch) {
    return res.status(200).json({ message: "Invalid credentials", success: 0 });
  }

  // Generate JWT
  const token = jwt.sign({ username: admin[0].username }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "Login successful", token, success: 1 });
};

export const GetUsers = async (req, res) => {
  const users = await Users.find({ ban: false }).populate(
    "contacts.userId",
    "profilePic fullname email phone"
  );
  res.status(200).json({ users, success: 1 });
};

export const GetGroups = async (req, res) => {
  const groups = await Group.find()
    .populate("admin", "profilePic fullname email")
    .populate("members", "profilePic fullname email");
  res.status(200).json({ groups, success: 1 });
};

export const DeleteUser = async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, { ban: true });
  res.status(200).json({ message: "User deleted successfully", success: 1 });
};

export const DeleteGroup = async (req, res) => {
  const { id } = req.params;
  let group = await Group.findById(id);

  group?.members?.forEach((user) => {
    let socketId = getUserSocketId(user);
    if (socketId) {
      io.to(socketId).emit("deleteGroup", id);
    }
  });

  await Message.deleteMany({ receiver: id });
  await Group.findByIdAndDelete(id);
  res.status(200).json({ message: "Group deleted successfully", success: 1 });
};
