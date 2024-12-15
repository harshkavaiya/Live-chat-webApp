import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";
export const AuthRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized -no token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "unauthorized -Invalid token" });
    }
    const user = await Users.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in authRoute middleware: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};