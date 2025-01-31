import express from "express";

import { UploadStatus,getUserStatus ,FriendStatus} from "../controllers/status.controller.js";
import { AuthRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/upload", AuthRoute, UploadStatus);
router.get("/:id",AuthRoute,getUserStatus)
router.post("/friendStatus",AuthRoute,FriendStatus)
export default router;
