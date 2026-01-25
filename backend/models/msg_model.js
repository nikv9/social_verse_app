import mongoose from "mongoose";

const msgSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", msgSchema);

export default Message;
