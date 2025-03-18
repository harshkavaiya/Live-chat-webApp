import expres from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  FetchUser,
  ForgetPassword,
  VerifyOtp,
  UpdatePassword,
} from "../controllers/auth.controller.js";
import { AuthRoute } from "../middleware/auth.middleware.js";
const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user/:id", AuthRoute, FetchUser);
router.put("/update-profile", AuthRoute, updateProfile);
router.get("/check", AuthRoute, checkAuth);
router.post("/forget", ForgetPassword);
router.post("/OtpVerify", VerifyOtp);
router.post("/updatePassword", UpdatePassword);

export default router;
