import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, default: "" },
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    clearedAt: {
      type: Map,
      of: Date,
      default: {},
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
