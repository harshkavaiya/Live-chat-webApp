import express from "express";

import {
  GetGroups,
  GetUsers,
  Login,
  Register,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login); 
router.get("/users", GetUsers);
router.get("/groups", GetGroups);

export default router;
