import express from "express";
const router = express.Router();
import authController from "../controller/auth.js";
import { loginCheck, isAuth, isAdmin } from "../middleware/auth.js";

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);

export default router;
