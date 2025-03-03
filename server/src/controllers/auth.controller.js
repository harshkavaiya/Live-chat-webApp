import { generateToken } from "../lib/generateToken.js";
import Users from "../models/users.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  if (!fullname || !email || !password || !phone)
    return res
      .status(200)
      .json({ success: false, message: "all fields required" });

  if (password.length <= 5) {
    return res.status(200).send("Password must be at least 6 character");
  }

  try {
    const user = await Users.findOne({ phone });
    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "phone number uncorrect" });
    }

    const usermail = await Users.findOne({ email });
    if (usermail) {
      return res
        .status(200)
        .json({ success: false, message: "email already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Users({
      fullname,
      phone,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        phone: newUser.phone,
        email: newUser.email,
        profilePic: newUser.profilePic,
        success: true,
      });
    } else {
      res.status(200).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller: ", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res
      .status(200)
      .json({ success: false, message: "All field required" });
  }
  try {
    const user = await Users.findOne({ phone });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "phone or Password uncorrect" });
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res
        .status(200)
        .json({ success: false, message: "phone or Password uncorrect" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      profilePic: user.profilePic,
      success: true,
    });
  } catch (error) {
    console.log("error in login controller: ", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout controller: ", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userName, Email, About, base64Image } = req.body;
    const userId = req.user._id;

    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let updateFields = {};

    if (userName && userName !== user.fullname) {
      updateFields.fullname = userName;
    }

    if (Email && Email !== user.email) {
      updateFields.email = Email;
    }

    if (About && About !== user.about) {
      updateFields.about = About;
    }

    if (base64Image) {
      const cloudPic = await cloudinary.uploader.upload(base64Image);
      updateFields.profilePic = cloudPic.secure_url;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No changes detected" });
    }

    const updatedUser = await Users.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Error in update-profile controller:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("error in checkAuth controller: ", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const FetchUser = async (req, res) => {
  const { id } = req.params;

  const user = await Users.findById(id).select(
    "phone email fullname profilpic"
  );

  res.status(200).json({ success: 1, user });
};
