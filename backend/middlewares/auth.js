import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader && !authHeader?.startsWith("Bearer ")) {
      return res.status(400).send("Token not found");
    }
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
    const decode = jwt.verify(token, process.env.jwt_key);
    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    return next(error);
  }
};

export const authRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(400).send("Only admin can do that!");
      }
      next();
    } catch (error) {
      return next(error);
    }
  };
};
