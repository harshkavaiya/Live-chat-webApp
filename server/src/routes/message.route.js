import express from "express";
import { AuthRoute } from "../middleware/auth.middleware.js";
import {
  addNewContact,
  contactList,
  sidebarUser,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", AuthRoute, sidebarUser);
router.get("/contactlist", AuthRoute, contactList);
router.post("/newcontact", AuthRoute, addNewContact);

export default router;
