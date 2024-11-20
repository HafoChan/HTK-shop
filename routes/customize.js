import express from "express";
const router = express.Router();
import customizeController from "../controller/customize.js";
import multer from "multer";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/customize");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Lấy tất cả hình ảnh slide
router.get("/slides", customizeController.getImages);

router.get("/slides/:id", customizeController.getSingleImage);

// Tải lên hình ảnh slide mới
router.post(
  "/slides",
  loginCheck,
  isAuth,
  isAdmin,
  upload.single("image"),
  customizeController.uploadSlideImage
);

router.put(
  "/slides/:id",
  loginCheck,
  isAuth,
  isAdmin,
  upload.single("image"),
  customizeController.updateSlideImage
);

// Xóa hình ảnh slide
router.delete(
  "/slides/:id",
  loginCheck,
  isAuth,
  isAdmin,
  customizeController.deleteSlideImage
);

// Lấy dữ liệu tổng quan cho dashboard
router.get("/dashboard", customizeController.getAllData);

export default router;
