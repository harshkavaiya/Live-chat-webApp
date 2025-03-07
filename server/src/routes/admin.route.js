import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingAdmin = await Admin.find({ username });
  if (existingAdmin.length) {
    return res.status(200).json({ message: "Admin already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let insert = await Admin.create({ username, password: hashedPassword });

  res.status(201).json({ message: "Admin registered successfully" });
});

// Login route
router.post("/login", async (req, res) => {
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
});

export default router;
