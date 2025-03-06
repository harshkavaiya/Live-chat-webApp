import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Mock database
const admins = [];

// Register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingAdmin = admins.find((admin) => admin.username === username);
  if (existingAdmin) {
    return res.status(200).json({ message: "Admin already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save admin to "database"
  const newAdmin = { username, password: hashedPassword };
  admins.push(newAdmin);

  res.status(201).json({ message: "Admin registered successfully" });
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find admin in "database"
  const admin = admins.find((admin) => admin.username === username);
  if (!admin) {
    return res.status(200).json({ message: "Invalid credentials", success: 0 });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(200).json({ message: "Invalid credentials", success: 0 });
  }

  // Generate JWT
  const token = jwt.sign({ username: admin.username }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "Login successful", token, success: 1 });
});

export default router;
