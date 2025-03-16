import express from "express";
import cron from "node-cron";
import {
  UploadStatus,
  getUserStatus,
  FriendStatus,
  handleStatusSeen,
  DeleteStatus,
} from "../controllers/status.controller.js";
import { AuthRoute } from "../middleware/auth.middleware.js";
import Status from "../models/status.model.js";
import { io, getUserSocketId } from "../lib/socket-io.js";

const router = express.Router();

router.post("/upload", AuthRoute, UploadStatus);
router.get("/:id", AuthRoute, getUserStatus);
router.post("/friendStatus", AuthRoute, FriendStatus);
router.post("/seen/:id", AuthRoute, handleStatusSeen);
router.delete("/delete/:id", AuthRoute, DeleteStatus);

cron.schedule("*/10 * * * * *", async () => {
  try {
    const find = await Status.find(); // Fetch all statuses

    for (let sts of find) {
      let length = sts.length;
      // Filter out expired status entries
      sts.status = sts.status.filter((element) => {
        return element.time >= new Date(Date.now() - 10 * 1000);
      });

      if (sts.status.length === 0) {
        await Status.deleteOne({ _id: sts._id });
        io.emit("refreshStatus");
      } else {
        if (length != sts.length) {
          io.emit("refreshStatus");
        }
        await sts.save();
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

export default router;
