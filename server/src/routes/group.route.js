import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import {
  addMember,
  assignAdmin,
  createGroup,
  joinGroup,
  toggleMessagePermission,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", AuthRoute, createGroup);
router.post("/join/:invite", AuthRoute, joinGroup);
router.post("/addMember", AuthRoute, addMember);
router.post("/assignAdmin", AuthRoute, assignAdmin);
router.post("/messagePermission", AuthRoute, toggleMessagePermission);

export default router;
