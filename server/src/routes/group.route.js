import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import { createGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", AuthRoute, createGroup);

export default router;
