import express from "express";
const router = express.Router();
import customizeController from "../controller/customize.js";
import multer from "multer";

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

// Tải lên hình ảnh slide mới
router.post(
  "/slides",
  upload.single("image"),
  customizeController.uploadSlideImage
);

// Xóa hình ảnh slide
router.delete("/slides/:id", customizeController.deleteSlideImage);

// Lấy dữ liệu tổng quan cho dashboard
router.get("/dashboard", customizeController.getAllData);

export default router;
