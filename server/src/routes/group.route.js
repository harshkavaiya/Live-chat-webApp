import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import { createGroup } from "../controllers/group.controller.js";
import upload from "../middleware/uploadGP.middleware.js";

const router = express.Router();

router.post("/create", AuthRoute, upload.single("photo"), createGroup);

export default router;
