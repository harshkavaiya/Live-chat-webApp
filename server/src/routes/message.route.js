import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import { __dirname } from "../index.js";
import {
  addNewContact,
  contactList,
  deleteContact,
  getMessages,
  sendMessage,
  clearChat,
  sidebarUser,
  MessageReaction,
  handleVote,
  DeleteMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", AuthRoute, sidebarUser);
router.get("/contactlist", AuthRoute, contactList);
router.post("/newcontact", AuthRoute, addNewContact);
router.post("/deletecontact", AuthRoute, deleteContact);
router.get("/chat/:id", AuthRoute, getMessages);
router.post("/send/:id", AuthRoute, sendMessage);
router.delete("/clearChat/:id", AuthRoute, clearChat);
router.delete("/deleteMessage", AuthRoute, DeleteMessage);
router.post("/reaction", AuthRoute, MessageReaction);
router.post("/sendVote/:id", AuthRoute, handleVote);

export default router;
