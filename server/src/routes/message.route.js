import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import {
  addNewContact,
  contactList,
  getMessages,
  sendMessage,
  sidebarUser,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", AuthRoute, sidebarUser);
router.get("/contactlist", AuthRoute, contactList);
router.post("/newcontact", AuthRoute, addNewContact);
router.get("/chat/:id", AuthRoute, getMessages);
router.post("/send/:id", AuthRoute, sendMessage);

export default router;
