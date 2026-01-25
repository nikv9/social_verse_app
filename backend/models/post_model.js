import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      max: 500,
    },
    media: {
      mediaId: {
        type: String,
      },
      mediaUrl: {
        type: String,
      },
    },
    mediaType: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);

export default Post;
