import express from "express";
import {
  forgotPass,
  logoutUser,
  resetPass,
  signinUser,
  signinWithGoogle,
  signupUser,
} from "../controllers/auth_ctrl.js";

const router = express.Router();

// static routes
router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/signin/google", signinWithGoogle);
router.get("/logout", logoutUser);
router.post("/pass/forgot", forgotPass);

// dynamic routes
router.put("/pass/reset/:token", resetPass);
export default router;
