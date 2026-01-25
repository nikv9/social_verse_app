import Post from "../models/post_model.js";
import cloudinary from "cloudinary";
import ErrHandler from "../middlewares/err_handler.js";
import User from "../models/user_model.js";

export const createPost = async (req, res, next) => {
  try {
    const { desc, media, mediaType } = req.body;

    if (!desc && !media) {
      return next(new ErrHandler(400, "Please fill any field!"));
    }

    let mediaVal;
    if (media) {
      if (mediaType === "photo") {
        mediaVal = await cloudinary.v2.uploader.upload(media, {
          folder: "cnectify/posts/photos",
        });
      } else if (mediaType === "video") {
        mediaVal = await cloudinary.v2.uploader.upload(media, {
          folder: "cnectify/posts/videos",
          resource_type: "video",
          chunk_size: 6000000,
        });
      } else {
        return next(new ErrHandler(400, "Invalid media type"));
      }
    }

    const post = await Post.create({
      userId: req.user._id,
      description: desc,
      media: {
        mediaId: media ? mediaVal.public_id : "",
        mediaUrl: media ? mediaVal.secure_url : "",
      },
      mediaType: media ? mediaType : "",
    });

    res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ErrHandler(404, "Post not found!"));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const page = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.perPageLimit) || 5;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .populate("userId", "_id name profileImg")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    return next(error);
  }
};

export const likeDislikePost = async (req, res, next) => {
  try {
    const { postId, userId, action } = req.body;

    const post = await Post.findById(postId).populate(
      "userId",
      "_id name profilePic"
    );

    if (action === "like") {
      post.likes.push(userId);
    } else {
      post.likes.pull(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (
      user.role === "admin" ||
      post?.userId?.toString() === user._id.toString()
    ) {
      await post.deleteOne();
      if (post.media && post.media.mediaId) {
        await cloudinary.v2.uploader.destroy(post.media.mediaId);
      }
      res.status(200).json("Post has been deleted!");
    }
  } catch (error) {
    return next(error);
  }
};
