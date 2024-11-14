import express from "express";
const router = express.Router();
import authController from "../controller/auth.js";
import { loginCheck, isAuth, isAdmin } from "../middleware/auth.js";

router.post("/isadmin", authController.isAdmin); // Cần đổi thành get
router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);
// router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

export default router;
