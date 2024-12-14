import expres from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { AuthRoute } from "../middleware/auth.middleware.js";
const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", AuthRoute, updateProfile);

export default router;
