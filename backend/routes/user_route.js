import express from "express";
import { authRole, authenticated } from "../middlewares/auth.js";
import {
  getUsers,
  getUser,
  deleteUser,
  createOrUpdateUser,
  sendFollowReq,
  respondToFollowReq,
  getFollowReqs,
  manageFollowRelation,
  getAllUsersAndPosts,
  getUserPosts,
} from "../controllers/user_ctrl.js";

const router = express.Router();

// static routes
router.get("/users", authenticated, getUsers);
router.post("/users", authenticated, authRole("admin"), createOrUpdateUser);
router.post("/users/follow/request", authenticated, sendFollowReq);
router.post("/users/follow/respond", authenticated, respondToFollowReq);
router.get("/users/follow-requests", authenticated, getFollowReqs);
router.put("/users/follow/manage", authenticated, manageFollowRelation);
router.get("/profile", authenticated, getUser);
router.put("/profile", authenticated, createOrUpdateUser);
router.get(
  "/users-posts",
  authenticated,
  authRole("admin"),
  getAllUsersAndPosts
);

// dynamic routes
router.get("/users/:userId/posts", authenticated, getUserPosts);
router.get("/users/:id", authenticated, getUser);
router.delete("/users/:id", authenticated, authRole("admin"), deleteUser);

export default router;
