import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import {
  addMember,
  assignAdmin,
  createGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroup,
  removeMember,
  toggleMessagePermission,RemoveAdmin
} from "../controllers/group.controller.js";
import mongoose from "mongoose";

const router = express.Router();

const validateGroupId = (req, res, next) => {
  const { groupId } = req.body;
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(200)
      .json({ success: false, message: "Invalid or missing Group IDd" });
  }

  next();
};

router.post("/create", AuthRoute, createGroup);
router.post("/join/:invite", AuthRoute, joinGroup);
router.post("/addMember", AuthRoute, addMember);
router.post("/assignAdmin", AuthRoute, assignAdmin);
router.post("/removeAdmin", AuthRoute, validateGroupId, RemoveAdmin);
router.post("/messagePermission", AuthRoute, toggleMessagePermission);
router.post("/delete", AuthRoute, validateGroupId, deleteGroup);
router.post("/removeMember", AuthRoute, validateGroupId, removeMember); ///not properly implemented
router.post("/leave", AuthRoute, validateGroupId, leaveGroup); ///not properly implemented
router.get("/getGroup", AuthRoute, getGroup);

export default router;
