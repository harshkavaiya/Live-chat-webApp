import { generateToken } from "../lib/generateToken.js";
import Users from "../models/users.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Otp from "../models/otp.model.js";

export const signup = async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  if (!fullname || !email || !password || !phone)
    return res
      .status(200)
      .json({ success: false, message: "all fields required" });

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
    return res.status(200).json({ success: 0, message: "All field required" });
  }
  try {
    const user = await Users.findOne({ phone });
    if (!user) {
      return res
        .status(200)
        .json({ success: 0, message: "phone or Password uncorrect" });
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res
        .status(200)
        .json({ success: 0, message: "phone or Password uncorrect" });
    }

    if (user.ban) {
      return res.status(200).json({ success: 0, message: "User is banned" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      profilePic: user.profilePic,
      success: 1,
    });
  } catch (error) {
    console.log("error in login controller: ", error.message);
    res.status(200).json({ success: 0, message: "Server error" });
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

export const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  let find = await Users.find({ email });

  if (!find.length)
    return res.status(200).json({ success: 0, message: "Email Not Found" });

  let check = await Otp.findById(find[0]._id);

  if (check)
    return res
      .status(200)
      .json({ success: 1, message: "Otp is All Ready Send" });

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();
  const otp = generateOTP(); // Generate a 6-digit OTP
  // Configure the transporter (using Gmail SMTP as an example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hardikvatukiya0014@gmail.com", // Replace with your email
      pass: "ttdh uzvc hqqi daxy", // Replace with your email password or App Password
    },
  });

  // Email options
  const mailOptions = {
    from: "hardikvatukiya0014@gmail.com",
    to: email,
    subject: "Your OTP Code for Change Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">🔒 Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">Use the following OTP to complete your verification:</p>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #000; background: #f3f3f3; padding: 10px; border-radius: 5px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #999;">If you didn’t request this, please ignore this email or contact support.</p>
      </div>
    `,
  };

  await Otp.create({
    userId: find[0]._id,
    email,
    otp,
  });
  // Send email
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: 1 });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: 0, message: "Some Error So Email Not Found" });
  }
};

export const VerifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  let otpRecord = await Otp.find({ email, otp });

  if (!otpRecord.length) {
    return res.status(200).json({ success: 0, message: "Invalid OTP" });
  }

  if (otpRecord[0].expiresAt < new Date()) {
    await Otp.deleteOne({ email }); // Delete expired OTP
    return res.status(200).json({ success: 0, message: "OTP has expired" });
  }
  await Otp.findOneAndUpdate({ email }, { verified: true });
  res.status(200).json({ success: 1, message: "OTP verified successfully" });
};

export const UpdatePassword = async (req, res) => {
  const { password, email } = req.body;

  let otpRecord = await Otp.find({ email, verified: true });

  if (!otpRecord.length)
    return res
      .status(200)
      .json({ success: 0, message: "Your Tokan is Expire" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await Otp.findByIdAndDelete(otpRecord[0]._id);
  await Users.findOneAndUpdate({ email: email }, { password: hashedPassword });

  res.status(200).json({ success: 1 });
};
