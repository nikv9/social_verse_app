import Chat from "../models/chat_model.js";
import Message from "../models/msg_model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId, loggedinUserId } = req.body;
    if (!content || !chatId)
      return res.status(400).json({ msg: "Invalid data" });

    const message = await Message.create({
      sender: loggedinUserId,
      content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id.toString();

    const chat = await Chat.findById(chatId).lean();

    let query = { chat: chatId };

    const clearedAt = chat?.clearedAt?.[userId];

    if (clearedAt) {
      query.createdAt = { $gt: new Date(clearedAt) };
    }

    const messages = await Message.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};
