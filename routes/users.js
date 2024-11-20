import express from "express";
import { loginCheck, isAuth, isAdmin } from "../middleware/auth.js";
const router = express.Router();
import usersController from "../controller/users.js";

router.get("/", loginCheck, isAuth, isAdmin, usersController.getAllUser);

router.get("/:id", loginCheck, isAuth, usersController.getSingleUser);

// Tạo người dùng nằm ở auth nên không có ở đây

router.put("/:id", loginCheck, isAuth, usersController.putEditUser);

router.delete("/:id", loginCheck, isAuth, isAdmin, usersController.deleteUser);

router.put(
  "/:id/change-password",
  loginCheck,
  isAuth,
  usersController.changePassword
);

export default router;
