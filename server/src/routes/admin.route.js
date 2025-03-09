import express from "express";

import {
  GetGroups,
  GetUsers,
  Login,
  Register,
  DeleteUser,
  DeleteGroup,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/users", GetUsers);
router.get("/groups", GetGroups);
router.delete("/deleteUser/:id", DeleteUser);
router.delete("/deleteGroup/:id", DeleteGroup);

export default router;
