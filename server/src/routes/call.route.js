import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import { GetCalls } from "../controllers/call.controller.js";
const router = express.Router();

router.get("/get", AuthRoute, GetCalls);

export default router;
