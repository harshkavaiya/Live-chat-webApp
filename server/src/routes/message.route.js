import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import {
  addNewContact,
  contactList,
  deleteContact,
  getMessages,
  sendMessage,
  sidebarUser,MessageReaction
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", AuthRoute, sidebarUser);
router.get("/contactlist", AuthRoute, contactList);
router.post("/newcontact", AuthRoute, addNewContact);
router.post("/deletecontact", AuthRoute, deleteContact);
router.get("/chat/:id", AuthRoute, getMessages);
router.post("/send/:id", AuthRoute, sendMessage);
router.post("/reaction",AuthRoute,MessageReaction)
export default router;
