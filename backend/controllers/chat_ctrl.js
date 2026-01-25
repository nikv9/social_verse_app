import mongoose from "mongoose";
import Chat from "../models/chat_model.js";

export const accessChat = async (req, res, next) => {
  try {
    const { loggedinUserId, targetUserId } = req.body;
    if (!targetUserId)
      return res.status(400).json({ msg: "targetUserId required" });

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [loggedinUserId, targetUserId], $size: 2 },
    }).populate("participants", "name email");

    if (!chat) {
      chat = await Chat.create({
        participants: [loggedinUserId, targetUserId],
      });
    }

    res.json(chat);
  } catch (err) {
    next(err);
  }
};
export const getChats = async (req, res, next) => {
  try {
    const userId = req.params.loggedinUserId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email profileImg")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const filtered = chats.filter((chat) => {
      const clearedAt = chat.clearedAt?.get(userId);
      if (!clearedAt) return true;
      return chat.latestMessage?.createdAt > clearedAt;
    });

    res.json(filtered);
  } catch (err) {
    next(err);
  }
};

export const deleteChatForMe = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { loggedinUserId } = req.body;

    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [`clearedAt.${loggedinUserId}`]: new Date(),
      },
    });

    res.json({ msg: "Chat cleared for you" });
  } catch (err) {
    next(err);
  }
};
