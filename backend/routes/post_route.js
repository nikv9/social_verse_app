import express from "express";
import { authenticated } from "../middlewares/auth.js";
import {
  createPost,
  deletePost,
  getPost,
  likeDislikePost,
  getPosts,
} from "../controllers/post_ctrl.js";

const router = express.Router();

// static routes
router.post("/posts", authenticated, createPost);
router.get("/posts", authenticated, getPosts);
router.put("/posts/like-dislike", authenticated, likeDislikePost);

// dynamic routes
router.get("/posts/:id", authenticated, getPost);
router.delete("/posts/:id", authenticated, deletePost);

export default router;
