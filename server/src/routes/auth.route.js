import expres from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { AuthRoute } from "../middleware/auth.middleware.js";
const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update-profile", AuthRoute, updateProfile);
router.get("/check", AuthRoute, checkAuth);

export default router;
