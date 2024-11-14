import express from "express";
import {loginCheck, isAuth, isAdmin} from "../middleware/auth.js";
const router = express.Router();
import usersController from "../controller/users.js";

router.get("/", loginCheck, isAuth, isAdmin, usersController.getAllUser); // Lấy tất cả người dùng
router.get("/:id", loginCheck, isAuth, usersController.getSingleUser); // Lấy thông tin một người dùng cụ thể

// router.post("/", usersController.postAddUser); // Tạo người dùng mới (nếu cần)
router.put("/:id", loginCheck, isAuth, usersController.putEditUser); // Cập nhật thông tin người dùng
router.delete("/:id", loginCheck, isAuth, isAdmin, usersController.deleteUser); // Xóa người dùng

router.put("/:id/change-password", usersController.changePassword); // Đổi mật khẩu người dùng

export default router;
