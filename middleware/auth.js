import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/keys.js";
import userModel from "../models/users.js";

export const loginCheck = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    res.status(401).json({
      error: "You must be logged in",
    });
  }
};

export const isAuth = (req, res, next) => {
  if (!req.userDetails._id) {
    return res.status(403).json({ error: "You are not authenticated" });
  }
  next();
};

export const isAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.userDetails._id);
    if(!reqUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // If user role 0 that's mean not admin it's customer
    if (reqUser.userRole === 0) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch(err) {
    next(err);
  }
};
