import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";

export const AuthRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        success: false,
        message: "unauthorized -no token provided",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.json({
        success: false,
        message: "unauthorized -Invalid token",
      });
    }
    const user = await Users.findById(decode.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in authRoute middleware: ", error.message);
    res.status(200).json({ message: "Server error" });
  }
};
