import express from "express";
const router = express.Router();
import categoryController from "../controller/categories.js";
import multer from "multer";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

// Image Upload setting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", categoryController.getAllCategory);

router.post(
  "/",
  loginCheck,
  isAdmin,
  upload.single("cImage"),
  categoryController.postAddCategory
);

router.put("/:id", loginCheck, isAdmin, categoryController.putEditCategory);

router.delete("/:id", loginCheck, isAdmin, categoryController.deleteCategory);

export default router;
