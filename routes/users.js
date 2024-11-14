import express from "express";
const router = express.Router();
import usersController from "../controller/users.js";

router.get("/", usersController.getAllUser); // Lấy tất cả người dùng
router.get("/:id", usersController.getSingleUser); // Lấy thông tin một người dùng cụ thể

// router.post("/", usersController.postAddUser); // Tạo người dùng mới (nếu cần)
router.put("/:id", usersController.putEditUser); // Cập nhật thông tin người dùng
router.delete("/:id", usersController.deleteUser); // Xóa người dùng

router.put("/:id/change-password", usersController.changePassword); // Đổi mật khẩu người dùng

export default router;
