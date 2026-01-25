import express from "express";
import { authenticated } from "../middlewares/auth.js";
import { getMessages, sendMessage } from "../controllers/msg_ctrl.js";

const router = express.Router();

// static routes
router.post("/msgs", authenticated, sendMessage);

// dynamic routes
router.get("/msgs/:chatId", authenticated, getMessages);

export default router;
