import User from "../models/user_model.js";
import cloudinary from "cloudinary";
import ErrHandler from "../middlewares/err_handler.js";
import bcrypt from "bcryptjs";
import Post from "../models/post_model.js";

export const getUsers = async (req, res, next) => {
  try {
    if (req.query.isAdmin === "true" && req.user.role === "admin") {
      const { userName, sort = "asc", page = 1, limit = 5 } = req.query;

      // searching
      const filter = userName
        ? { name: { $regex: userName, $options: "i" } } // case-insensitive
        : {};

      // sorting
      const sortOrder = sort === "asc" ? 1 : -1;

      // pagination
      const skip = (Number(page) - 1) * Number(limit);

      const users = await User.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort({ name: sortOrder })
        .skip(skip)
        .limit(Number(limit));

      const totalUsers = await User.countDocuments(filter);

      return res.status(200).json({
        users,
        totalUsers,
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
      });
    }

    const currentUserId = req.query.userId;
    const userName = req.query.userName;
    const searchType = req.query.searchType;

    let filter = {};

    if (searchType === "userSuggestions") {
      filter._id = { $ne: currentUserId };
    } else if (searchType === "followers") {
      const currentUser = await User.findById(currentUserId).populate(
        "followers"
      );
      const followers = currentUser.followers.map((user) => user._id);
      filter._id = { $in: followers };
    } else {
      const currentUser = await User.findById(currentUserId).populate(
        "followings"
      );
      const followings = currentUser.followings.map((user) => user._id);
      filter._id = { $nin: [currentUserId, ...followings] };
    }

    if (userName) {
      filter.name = { $regex: userName, $options: "i" };
    }

    const users = await User.find(filter).sort({ _id: -1 });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;

    const user = await User.findById(userId)
      .populate("followings", "name profileImg")
      .populate("followers", "name profileImg");

    if (!user) {
      return next(new ErrHandler(404, "User not found!"));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrHandler(404, "User not found!"));
    }

    // Find all posts by this user
    const userPosts = await Post.find({ userId: user._id });

    // Delete each post's image(s) from Cloudinary
    for (const post of userPosts) {
      if (post.image?.imgId) {
        // single image post
        await cloudinary.v2.uploader.destroy(post.image.imgId);
      } else if (post.images?.length) {
        // multiple image post
        for (const img of post.images) {
          if (img.imgId) await cloudinary.v2.uploader.destroy(img.imgId);
        }
      }
    }

    // Delete all posts by this user from DB
    await Post.deleteMany({ userId: user._id });

    // Remove this user from others’ followers & followings
    await User.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } }
    );

    await User.updateMany(
      { followings: user._id },
      { $pull: { followings: user._id } }
    );

    // Delete user's profile image from Cloudinary if exists
    if (user.profileImg?.imgId) {
      await cloudinary.v2.uploader.destroy(user.profileImg.imgId);
    }

    // Finally delete user itself
    await User.findByIdAndDelete(user._id);

    res.status(200).json("User and all related data deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateUser = async (req, res, next) => {
  try {
    const { id, name, email, password, role, profileImg } = req.body;

    let myCloud;
    let user;

    if (id) {
      user = await User.findById(id);
      if (!user) return next(new ErrHandler(404, "User not found for update!"));
    }

    if (profileImg && !profileImg.startsWith("https")) {
      if (user?.profileImg?.imgId) {
        await cloudinary.v2.uploader.destroy(user.profileImg.imgId);
      }

      myCloud = await cloudinary.v2.uploader.upload(profileImg, {
        folder: "cnectify/profile_imgs",
      });
    }

    const updateData = {
      name, // required
      email, // required
      ...(role && { role }), // optional
      ...(password && { password: await bcrypt.hash(password, 12) }), // optional
      ...(myCloud && {
        profileImg: {
          imgId: myCloud.public_id,
          imgUrl: myCloud.secure_url,
        },
      }), // optional
    };

    if (id) {
      user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      user = await User.create(updateData);
    }

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort(
      "-createdAt"
    );
    res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

export const sendFollowReq = async (req, res, next) => {
  try {
    const { loggedinUserId, targetUserId } = req.body;

    if (loggedinUserId === targetUserId)
      return next(new ErrHandler(400, "You cannot follow yourself!"));

    const loggedinUser = await User.findById(loggedinUserId);
    const targetUser = await User.findById(targetUserId);

    // if already following
    if (loggedinUser.followings.includes(targetUserId))
      return res.status(400).json({ msg: "Already following this user." });

    // if already requested
    if (loggedinUser.followReqsSent.includes(targetUserId))
      return res.status(400).json({ msg: "Follow request already sent." });

    // add to both sides
    loggedinUser.followReqsSent.push(targetUserId);
    targetUser.followReqsReceived.push(loggedinUserId);

    await loggedinUser.save();
    await targetUser.save();

    res.status(200).json({ msg: "Follow request sent successfully." });
  } catch (error) {
    next(error);
  }
};

export const respondToFollowReq = async (req, res, next) => {
  try {
    const { loggedinUserId, targetUserId, action } = req.body;

    const loggedinUser = await User.findById(loggedinUserId);
    const requesterUser = await User.findById(targetUserId);

    if (action === "withdraw") {
      if (!loggedinUser.followReqsSent.includes(targetUserId))
        return res.status(400).json({ msg: "No follow request to withdraw." });

      loggedinUser.followReqsSent.pull(targetUserId);
      requesterUser.followReqsReceived.pull(loggedinUserId);

      await loggedinUser.save();
      await requesterUser.save();

      return res
        .status(200)
        .json({ msg: "Follow request withdrawn successfully." });
    }

    if (!loggedinUser.followReqsReceived.includes(targetUserId))
      return res.status(400).json({ msg: "No follow request from this user." });

    loggedinUser.followReqsReceived.pull(targetUserId);
    requesterUser.followReqsSent.pull(loggedinUserId);

    if (action === "accept") {
      loggedinUser.followers.push(targetUserId);
      requesterUser.followings.push(loggedinUserId);
    }

    await loggedinUser.save();
    await requesterUser.save();

    res.status(200).json({
      msg:
        action === "accept"
          ? "Follow request accepted."
          : "Follow request rejected.",
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowReqs = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId)
      .populate("followReqsSent", "name profileImg")
      .populate("followReqsReceived", "name profileImg");

    res.status(200).json({
      reqSent: user.followReqsSent,
      reqReceived: user.followReqsReceived,
    });
  } catch (error) {
    next(error);
  }
};

export const manageFollowRelation = async (req, res, next) => {
  try {
    const { loggedinUserId, targetUserId, action } = req.body;

    const loggedinUser = await User.findById(loggedinUserId);
    const targetUser = await User.findById(targetUserId);

    if (!loggedinUser || !targetUser)
      return next(new ErrHandler(404, "User not found."));

    if (action === "removeFollowing") {
      if (!loggedinUser.followings.includes(targetUserId))
        return next(new ErrHandler(400, "You are not following this user."));

      loggedinUser.followings.pull(targetUserId);
      targetUser.followers.pull(loggedinUserId);

      await loggedinUser.save();
      await targetUser.save();

      return res.status(200).json({ msg: "Unfollowed user successfully." });
    }

    if (action === "removeFollower") {
      if (!loggedinUser.followers.includes(targetUserId))
        return next(new ErrHandler(400, "User is not your follower."));

      loggedinUser.followers.pull(targetUserId);
      targetUser.followings.pull(loggedinUserId);

      await loggedinUser.save();
      await targetUser.save();

      return res.status(200).json({ msg: "Follower removed successfully." });
    }

    return next(new ErrHandler(400, "Invalid action."));
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAndPosts = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const posts = await Post.find()
      .populate("userId", "name email profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
