import express from "express";
import { authenticated } from "../middlewares/auth.js";
import {
  accessChat,
  deleteChatForMe,
  getChats,
} from "../controllers/chat_ctrl.js";

const router = express.Router();

// static routes
router.post("/chats", authenticated, accessChat);

// dynamic routes
router.get("/chats/:loggedinUserId", authenticated, getChats);

router.delete("/chats/:chatId", authenticated, deleteChatForMe);

export default router;
